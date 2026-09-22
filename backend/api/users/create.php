<?php
/**
 * ATITHYA360 – API: Create User by Admin
 * POST /api/users/create.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'district_admin', 'police_admin', 'property_owner']);
$input = Validator::getJsonInput();

$required = ['full_name', 'email', 'password', 'role_id'];
$missing = Validator::validateRequired($input, $required);
if (!empty($missing)) {
    Response::error('Missing required user creation fields.', $missing, 422);
}

if (!Validator::isValidEmail($input['email'])) {
    Response::error('Invalid email address format.', ['email' => 'Invalid'], 422);
}

try {
    $db = Database::getConnection();

    // Check duplicate email
    $check = $db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $check->execute([':email' => $input['email']]);
    if ($check->fetch()) {
        Response::error('User with this email already exists.', ['email' => 'Duplicate'], 409);
    }

    $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);
    $propId = !empty($input['property_id']) ? (int)$input['property_id'] : ($authUser['property_id'] ?? null);

    $stmt = $db->prepare("
        INSERT INTO users (
            role_id, full_name, email, password_hash, mobile, designation,
            state_id, district_id, police_station_id, property_id, status, created_at
        ) VALUES (
            :role_id, :full_name, :email, :password_hash, :mobile, :designation,
            :state_id, :district_id, :police_station_id, :property_id, :status, NOW()
        )
    ");

    $stmt->execute([
        ':role_id'           => (int)$input['role_id'],
        ':full_name'         => $input['full_name'],
        ':email'             => $input['email'],
        ':password_hash'     => $passwordHash,
        ':mobile'            => $input['mobile'] ?? null,
        ':designation'       => $input['designation'] ?? 'Staff',
        ':state_id'          => !empty($input['state_id']) ? (int)$input['state_id'] : null,
        ':district_id'       => !empty($input['district_id']) ? (int)$input['district_id'] : null,
        ':police_station_id' => !empty($input['police_station_id']) ? (int)$input['police_station_id'] : null,
        ':property_id'       => $propId,
        ':status'            => $input['status'] ?? 'Active'
    ]);

    $newId = (int)$db->lastInsertId();

    AuditLogger::log('Create User', 'User', (string)$newId, "Admin created user account for {$input['email']}", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('User account created successfully.', ['id' => $newId, 'email' => $input['email']], 201);
} catch (Exception $e) {
    Response::error('Failed to create user: ' . $e->getMessage(), [], 500);
}
