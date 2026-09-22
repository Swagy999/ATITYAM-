<?php
/**
 * ATITHYA360 – API: Auth Login
 * POST /api/auth/login.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', [], 405);
}

$input = Validator::getJsonInput();
$missing = Validator::validateRequired($input, ['email', 'password']);
if (!empty($missing)) {
    Response::error('Email and password are required.', $missing, 422);
}

$email = trim($input['email']);
$password = $input['password'];

try {
    $db = Database::getConnection();
    $stmt = $db->prepare("
        SELECT u.id, u.role_id, u.full_name, u.email, u.password_hash, u.mobile, u.designation,
               u.state_id, u.district_id, u.police_station_id, u.property_id, u.status,
               r.name AS role_name, r.slug AS role_slug,
               p.name AS property_name, p.property_code
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN properties p ON u.property_id = p.id
        WHERE u.email = :email
        LIMIT 1
    ");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        Response::error('Invalid email credentials.', ['auth' => 'User not found'], 401);
    }

    if ($user['status'] !== 'Active') {
        Response::forbidden('Account is currently inactive or suspended. Please contact administrator.');
    }

    // Verify Password (supports Bcrypt hashes or fallback test demo password 'Demo@123')
    $isValidPassword = password_verify($password, $user['password_hash']) || ($password === 'Demo@123');

    if (!$isValidPassword) {
        AuditLogger::log('Login Failed', 'User', (string)$user['id'], "Failed login attempt with email: $email", $user['id'], $email, $user['role_slug']);
        Response::error('Invalid credentials entered.', ['auth' => 'Password mismatch'], 401);
    }

    // Update last login timestamp
    $updateStmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
    $updateStmt->execute([':id' => $user['id']]);

    // Build payload and sign token
    $tokenPayload = [
        'id'                => (int)$user['id'],
        'email'             => $user['email'],
        'full_name'         => $user['full_name'],
        'role_id'           => (int)$user['role_id'],
        'role_name'         => $user['role_name'],
        'role_slug'         => $user['role_slug'],
        'designation'       => $user['designation'],
        'state_id'          => $user['state_id'] ? (int)$user['state_id'] : null,
        'district_id'       => $user['district_id'] ? (int)$user['district_id'] : null,
        'police_station_id' => $user['police_station_id'] ? (int)$user['police_station_id'] : null,
        'property_id'       => $user['property_id'] ? (int)$user['property_id'] : null,
        'property_name'     => $user['property_name'] ?? null,
        'property_code'     => $user['property_code'] ?? null
    ];

    $token = Auth::generateToken($tokenPayload);

    // Audit Successful Login
    AuditLogger::log('Login Succeeded', 'User', (string)$user['id'], "User logged in as {$user['role_name']}", $user['id'], $user['email'], $user['role_slug']);

    unset($user['password_hash']);

    Response::success('Login successful', [
        'token' => $token,
        'user'  => $tokenPayload
    ]);
} catch (Exception $e) {
    Response::error('Database error during authentication: ' . $e->getMessage(), [], 500);
}
