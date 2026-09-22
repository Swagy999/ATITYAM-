<?php
/**
 * ATITHYA360 – API: Digital Guest Check-In
 * POST /api/stays/checkin.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', [], 405);
}

$authUser = Auth::authenticate();
$input = Validator::getJsonInput();

$required = ['property_id', 'room_id', 'expected_checkout'];
$missing = Validator::validateRequired($input, $required);
if (!empty($missing)) {
    Response::error('Missing required check-in fields.', $missing, 422);
}

$propertyId = (int)$input['property_id'];
$roomId = (int)$input['room_id'];
RoleMiddleware::enforcePropertyAccess($authUser, $propertyId);

try {
    $db = Database::getConnection();

    $guestId = !empty($input['guest_id']) ? (int)$input['guest_id'] : 0;

    // If new guest details are passed directly with check-in, register guest first
    if ($guestId <= 0 && !empty($input['full_name']) && !empty($input['mobile'])) {
        $guestType = $input['guest_type'] ?? 'Indian Guest';
        $prefix = ($guestType === 'Foreign Visitor') ? 'GST-FOR' : 'GST-IND';
        $guestCode = $prefix . '-' . rand(1000, 9999);

        $gStmt = $db->prepare("
            INSERT INTO guests (
                guest_code, guest_type, full_name, dob, gender, mobile, email,
                nationality, address, city, state_id, country_id, emergency_contact,
                purpose_of_visit, passport_number, visa_number, visa_type, foreign_verification_status, created_at
            ) VALUES (
                :guest_code, :guest_type, :full_name, :dob, :gender, :mobile, :email,
                :nationality, :address, :city, :state_id, :country_id, :emergency_contact,
                :purpose_of_visit, :passport_number, :visa_number, :visa_type, :foreign_verification_status, NOW()
            )
        ");

        $gStmt->execute([
            ':guest_code'                  => $guestCode,
            ':guest_type'                  => $guestType,
            ':full_name'                   => $input['full_name'],
            ':dob'                         => !empty($input['dob']) ? $input['dob'] : null,
            ':gender'                      => $input['gender'] ?? 'Male',
            ':mobile'                      => $input['mobile'],
            ':email'                       => $input['email'] ?? null,
            ':nationality'                 => $input['nationality'] ?? 'Indian',
            ':address'                     => $input['address'] ?? 'Not Provided',
            ':city'                        => $input['city'] ?? 'Unknown',
            ':state_id'                    => !empty($input['state_id']) ? (int)$input['state_id'] : 1,
            ':country_id'                  => !empty($input['country_id']) ? (int)$input['country_id'] : (($guestType === 'Foreign Visitor') ? 3 : 1),
            ':emergency_contact'           => $input['emergency_contact'] ?? null,
            ':purpose_of_visit'            => $input['purpose_of_visit'] ?? 'Tourism',
            ':passport_number'             => $input['passport_number'] ?? null,
            ':visa_number'                 => $input['visa_number'] ?? null,
            ':visa_type'                   => $input['visa_type'] ?? null,
            ':foreign_verification_status' => ($guestType === 'Foreign Visitor') ? 'Verified' : 'Not Applicable'
        ]);

        $guestId = (int)$db->lastInsertId();

        // Attach Document Metadata if provided
        if (!empty($input['document_type']) && !empty($input['document_reference'])) {
            $docStmt = $db->prepare("
                INSERT INTO guest_documents (guest_id, document_type, document_reference, file_path, verification_status, uploaded_at)
                VALUES (:guest_id, :document_type, :document_reference, :file_path, 'Verified', NOW())
            ");
            $docStmt->execute([
                ':guest_id'           => $guestId,
                ':document_type'      => $input['document_type'],
                ':document_reference' => $input['document_reference'],
                ':file_path'          => $input['file_path'] ?? ('uploads/documents/doc_demo_' . $guestId . '.pdf')
            ]);
        }
    }

    if ($guestId <= 0) {
        Response::error('Guest registration or guest_id is required for check-in.', [], 422);
    }

    // Verify room availability
    $roomCheck = $db->prepare("SELECT id, room_number, status FROM rooms WHERE id = :id AND property_id = :prop_id LIMIT 1");
    $roomCheck->execute([':id' => $roomId, ':prop_id' => $propertyId]);
    $room = $roomCheck->fetch();

    if (!$room) {
        Response::error('Selected room is not associated with this property.', [], 404);
    }

    // Generate Unique Stay Code
    $stayCode = 'STY-' . date('Y') . '-' . rand(1000, 9999);
    $checkinTime = !empty($input['checkin_time']) ? $input['checkin_time'] : date('Y-m-d H:i:s');
    $expectedCheckout = $input['expected_checkout'];
    $numGuests = max(1, (int)($input['num_guests'] ?? 1));
    $destId = !empty($input['primary_destination_id']) ? (int)$input['primary_destination_id'] : null;

    $stayStmt = $db->prepare("
        INSERT INTO stays (
            stay_code, guest_id, property_id, room_id, num_guests,
            checkin_time, expected_checkout, stay_status, primary_destination_id, remarks, created_by, created_at
        ) VALUES (
            :stay_code, :guest_id, :property_id, :room_id, :num_guests,
            :checkin_time, :expected_checkout, 'Checked In', :primary_destination_id, :remarks, :created_by, NOW()
        )
    ");

    $stayStmt->execute([
        ':stay_code'              => $stayCode,
        ':guest_id'               => $guestId,
        ':property_id'            => $propertyId,
        ':room_id'                => $roomId,
        ':num_guests'             => $numGuests,
        ':checkin_time'           => $checkinTime,
        ':expected_checkout'      => $expectedCheckout,
        ':primary_destination_id' => $destId,
        ':remarks'                => $input['remarks'] ?? 'Digital registration check-in confirmed',
        ':created_by'             => $authUser['id']
    ]);

    $stayId = (int)$db->lastInsertId();

    // Update Room Status to Occupied
    $updateRoom = $db->prepare("UPDATE rooms SET status = 'Occupied' WHERE id = :id");
    $updateRoom->execute([':id' => $roomId]);

    AuditLogger::log('Guest Check-In', 'Stay', $stayCode, "Guest #$guestId checked into Room {$room['room_number']} at Property #$propertyId", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Guest checked in successfully.', [
        'stay_id'           => $stayId,
        'stay_code'         => $stayCode,
        'guest_id'          => $guestId,
        'room_number'       => $room['room_number'],
        'checkin_time'      => $checkinTime,
        'expected_checkout' => $expectedCheckout,
        'stay_status'       => 'Checked In'
    ], 201);
} catch (Exception $e) {
    Response::error('Check-in process failed: ' . $e->getMessage(), [], 500);
}
