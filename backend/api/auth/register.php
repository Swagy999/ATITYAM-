<?php
/**
 * ATITHYA360 – API: Auth Register (Property Owner / Operator Registration)
 * POST /api/auth/register.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', [], 405);
}

$input = Validator::getJsonInput();
$required = ['full_name', 'email', 'password', 'mobile'];
$missing = Validator::validateRequired($input, $required);
if (!empty($missing)) {
    Response::error('Required registration fields are missing.', $missing, 422);
}

if (!Validator::isValidEmail($input['email'])) {
    Response::error('Invalid email address format provided.', ['email' => 'Format invalid'], 422);
}

try {
    $db = Database::getConnection();

    // Check duplicate email
    $checkStmt = $db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $checkStmt->execute([':email' => $input['email']]);
    if ($checkStmt->fetch()) {
        Response::error('An account with this email address already exists.', ['email' => 'Duplicate email'], 409);
    }

    // Default role: Property Owner (role_id 7) unless specified
    $roleId = isset($input['role_id']) ? (int)$input['role_id'] : 7;
    $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);

    $stmt = $db->prepare("
        INSERT INTO users (role_id, full_name, email, password_hash, mobile, designation, state_id, district_id, status, created_at)
        VALUES (:role_id, :full_name, :email, :password_hash, :mobile, :designation, :state_id, :district_id, 'Active', NOW())
    ");

    $stmt->execute([
        ':role_id'       => $roleId,
        ':full_name'     => $input['full_name'],
        ':email'         => $input['email'],
        ':password_hash' => $passwordHash,
        ':mobile'        => $input['mobile'],
        ':designation'   => $input['designation'] ?? 'Property Owner',
        ':state_id'      => !empty($input['state_id']) ? (int)$input['state_id'] : null,
        ':district_id'   => !empty($input['district_id']) ? (int)$input['district_id'] : null
    ]);

    $newUserId = (int)$db->lastInsertId();

    AuditLogger::log('User Registered', 'User', (string)$newUserId, "New user registered with email: {$input['email']}", $newUserId, $input['email'], 'property_owner');

    Response::success('User account registered successfully. You can now log in.', [
        'user_id' => $newUserId,
        'email'   => $input['email']
    ], 201);
} catch (Exception $e) {
    Response::error('Registration failed: ' . $e->getMessage(), [], 500);
}
