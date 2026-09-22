<?php
/**
 * ATITHYA360 – API: Update User & Status
 * PUT / POST /api/users/update.php
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

$userId = (int)($input['id'] ?? $_GET['id'] ?? 0);
if ($userId <= 0) {
    Response::error('Invalid user ID parameter.', [], 400);
}

try {
    $db = Database::getConnection();

    $fields = ['full_name', 'mobile', 'designation', 'status', 'role_id', 'state_id', 'district_id', 'police_station_id', 'property_id'];
    $updates = [];
    $params = [':id' => $userId];

    foreach ($fields as $f) {
        if (isset($input[$f])) {
            $updates[] = "$f = :$f";
            $params[":$f"] = $input[$f];
        }
    }

    if (!empty($input['password'])) {
        $updates[] = "password_hash = :pwd";
        $params[':pwd'] = password_hash($input['password'], PASSWORD_BCRYPT);
    }

    if (empty($updates)) {
        Response::error('No update parameters were provided.', [], 400);
    }

    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    AuditLogger::log('Update User', 'User', (string)$userId, 'User profile/credentials adjusted', $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('User updated successfully.');
} catch (Exception $e) {
    Response::error('Failed to update user: ' . $e->getMessage(), [], 500);
}
