<?php
/**
 * ATITHYA360 – API: Create Guest (Indian & Foreign Visitor Registration)
 * POST /api/guests/create.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', [], 405);
}

$authUser = Auth::authenticate();
$input = Validator::getJsonInput();

$guestType = $input['guest_type'] ?? 'Indian Guest';
$required = ['full_name', 'mobile', 'address', 'city', 'nationality'];

if ($guestType === 'Foreign Visitor') {
    $required[] = 'passport_number';
    $required[] = 'visa_number';
}

$missing = Validator::validateRequired($input, $required);
if (!empty($missing)) {
    Response::error('Missing required guest fields.', $missing, 422);
}

try {
    $db = Database::getConnection();

    // Unique Guest Code Generator
    $prefix = ($guestType === 'Foreign Visitor') ? 'GST-FOR' : 'GST-IND';
    $guestCode = $prefix . '-' . rand(1000, 9999);

    $foreignVerification = ($guestType === 'Foreign Visitor') ? 'Verified' : 'Not Applicable';

    $stmt = $db->prepare("
        INSERT INTO guests (
            guest_code, guest_type, full_name, dob, gender, mobile, email,
            nationality, address, city, state_id, country_id, emergency_contact,
            purpose_of_visit, passport_number, visa_number, visa_type, visa_expiry,
            port_of_entry, foreign_verification_status, created_at
        ) VALUES (
            :guest_code, :guest_type, :full_name, :dob, :gender, :mobile, :email,
            :nationality, :address, :city, :state_id, :country_id, :emergency_contact,
            :purpose_of_visit, :passport_number, :visa_number, :visa_type, :visa_expiry,
            :port_of_entry, :foreign_verification_status, NOW()
        )
    ");

    $stmt->execute([
        ':guest_code'                  => $guestCode,
        ':guest_type'                  => $guestType,
        ':full_name'                   => $input['full_name'],
        ':dob'                         => !empty($input['dob']) ? $input['dob'] : null,
        ':gender'                      => $input['gender'] ?? 'Male',
        ':mobile'                      => $input['mobile'],
        ':email'                       => $input['email'] ?? null,
        ':nationality'                 => $input['nationality'],
        ':address'                     => $input['address'],
        ':city'                        => $input['city'],
        ':state_id'                    => !empty($input['state_id']) ? (int)$input['state_id'] : null,
        ':country_id'                  => !empty($input['country_id']) ? (int)$input['country_id'] : (($guestType === 'Foreign Visitor') ? 3 : 1),
        ':emergency_contact'           => $input['emergency_contact'] ?? null,
        ':purpose_of_visit'            => $input['purpose_of_visit'] ?? 'Tourism',
        ':passport_number'             => $input['passport_number'] ?? null,
        ':visa_number'                 => $input['visa_number'] ?? null,
        ':visa_type'                   => $input['visa_type'] ?? null,
        ':visa_expiry'                 => !empty($input['visa_expiry']) ? $input['visa_expiry'] : null,
        ':port_of_entry'               => $input['port_of_entry'] ?? null,
        ':foreign_verification_status' => $foreignVerification
    ]);

    $guestId = (int)$db->lastInsertId();

    // Auto-record document metadata if provided in payload
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

    AuditLogger::log('Register Guest', 'Guest', (string)$guestId, "Registered {$guestType}: {$input['full_name']} ({$guestCode})", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Guest registered successfully.', [
        'id'         => $guestId,
        'guest_code' => $guestCode,
        'full_name'  => $input['full_name'],
        'guest_type' => $guestType
    ], 201);
} catch (Exception $e) {
    Response::error('Failed to create guest record: ' . $e->getMessage(), [], 500);
}
