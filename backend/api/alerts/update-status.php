<?php
/**
 * ATITHYA360 – API: Update Alert Status & Resolution Review
 * POST /api/alerts/update-status.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'district_admin', 'police_admin', 'police_officer']);
$input = Validator::getJsonInput();

$alertId = (int)($input['alert_id'] ?? 0);
$status = trim($input['status'] ?? 'Resolved');
$notes = trim($input['resolved_notes'] ?? '');

if ($alertId <= 0 || !in_array($status, ['Open', 'Under Review', 'Resolved', 'Closed'], true)) {
    Response::error('Invalid alert ID or status option.', [], 422);
}

try {
    $db = Database::getConnection();

    $stmt = $db->prepare("
        UPDATE alerts
        SET status = :status,
            resolved_notes = :notes,
            resolved_at = CASE WHEN :status IN ('Resolved', 'Closed') THEN NOW() ELSE resolved_at END,
            assigned_to = :officer_id
        WHERE id = :id
    ");

    $stmt->execute([
        ':status'     => $status,
        ':notes'      => $notes,
        ':officer_id' => $authUser['id'],
        ':id'         => $alertId
    ]);

    AuditLogger::log('Update Alert Status', 'Alert', (string)$alertId, "Alert status transitioned to $status. Review notes: $notes", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success("Alert review status updated to '$status'.");
} catch (Exception $e) {
    Response::error('Failed to update alert: ' . $e->getMessage(), [], 500);
}
