<?php
/**
 * ATITHYA360 – API: Create Property
 * POST /api/properties/create.php
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

$required = ['name', 'property_type', 'owner_name', 'contact_number', 'email', 'address', 'city', 'district_id', 'state_id', 'pincode', 'police_station_id', 'license_number', 'registration_number', 'room_capacity'];
$missing = Validator::validateRequired($input, $required);
if (!empty($missing)) {
    Response::error('Missing required property fields.', $missing, 422);
}

try {
    $db = Database::getConnection();

    // Generate Unique Property Code
    $cityCode = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $input['city']), 0, 3)) ?: 'PRP';
    $propertyCode = 'PROP-' . $cityCode . '-' . rand(1000, 9999);

    $ownerId = $authUser['id'];
    // Initial status: Verified for demo, or Pending if specified
    $initialStatus = $input['status'] ?? 'Verified';

    $stmt = $db->prepare("
        INSERT INTO properties (
            property_code, name, property_type, owner_id, owner_name, contact_number, email,
            address, city, district_id, state_id, pincode, police_station_id,
            license_number, registration_number, room_capacity, contact_person, status, created_at
        ) VALUES (
            :property_code, :name, :property_type, :owner_id, :owner_name, :contact_number, :email,
            :address, :city, :district_id, :state_id, :pincode, :police_station_id,
            :license_number, :registration_number, :room_capacity, :contact_person, :status, NOW()
        )
    ");

    $stmt->execute([
        ':property_code'        => $propertyCode,
        ':name'                 => $input['name'],
        ':property_type'        => $input['property_type'],
        ':owner_id'             => $ownerId,
        ':owner_name'           => $input['owner_name'],
        ':contact_number'       => $input['contact_number'],
        ':email'                => $input['email'],
        ':address'              => $input['address'],
        ':city'                 => $input['city'],
        ':district_id'          => (int)$input['district_id'],
        ':state_id'             => (int)$input['state_id'],
        ':pincode'              => $input['pincode'],
        ':police_station_id'    => (int)$input['police_station_id'],
        ':license_number'       => $input['license_number'],
        ':registration_number'  => $input['registration_number'],
        ':room_capacity'        => (int)$input['room_capacity'],
        ':contact_person'       => $input['contact_person'] ?? $input['owner_name'],
        ':status'               => $initialStatus
    ]);

    $propertyId = (int)$db->lastInsertId();

    // Auto-create initial default standard rooms
    $roomCount = min((int)$input['room_capacity'], 10);
    $roomStmt = $db->prepare("INSERT INTO rooms (property_id, room_number, room_type, max_occupancy, status) VALUES (:property_id, :room_number, :room_type, 2, 'Available')");
    for ($i = 1; $i <= $roomCount; $i++) {
        $roomNum = str_pad($i, 3, '10', STR_PAD_LEFT);
        $type = ($i % 3 === 0) ? 'Suite' : (($i % 2 === 0) ? 'Deluxe' : 'Standard');
        $roomStmt->execute([
            ':property_id' => $propertyId,
            ':room_number' => (string)(100 + $i),
            ':room_type'   => $type
        ]);
    }

    // Update user's property_id if not set
    if (empty($authUser['property_id']) && $authUser['role_slug'] === 'property_owner') {
        $userUpdate = $db->prepare("UPDATE users SET property_id = :prop_id WHERE id = :user_id");
        $userUpdate->execute([':prop_id' => $propertyId, ':user_id' => $authUser['id']]);
    }

    AuditLogger::log('Create Property', 'Property', (string)$propertyId, "Registered property: {$input['name']} ({$propertyCode})", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Property registered successfully.', [
        'id'            => $propertyId,
        'property_code' => $propertyCode,
        'name'          => $input['name'],
        'status'        => $initialStatus
    ], 201);
} catch (Exception $e) {
    Response::error('Failed to create property: ' . $e->getMessage(), [], 500);
}
