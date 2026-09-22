<?php
/**
 * ATITHYA360 – API: System Settings
 * GET / POST /api/admin/system-settings.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin']);

try {
    $db = Database::getConnection();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = Validator::getJsonInput();
        if (empty($input)) {
            Response::error('No settings to update.', [], 400);
        }

        $stmt = $db->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = :v");
        foreach ($input as $k => $v) {
            $stmt->execute([':k' => $k, ':v' => (string)$v]);
        }

        AuditLogger::log('Update System Settings', 'System', 'CONFIG', 'System settings adjusted by administrator', $authUser['id'], $authUser['email'], $authUser['role_slug']);
        Response::success('Settings updated successfully.');
    }

    $settings = $db->query("SELECT * FROM system_settings ORDER BY category ASC, setting_key ASC")->fetchAll();
    Response::success('System settings retrieved', $settings);
} catch (Exception $e) {
    Response::error('Settings operation failed: ' . $e->getMessage(), [], 500);
}
