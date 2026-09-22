<?php
/**
 * ATITHYA360 – API: List System & Security Review Alerts
 * GET /api/alerts/list.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = Auth::authenticate();

try {
    $db = Database::getConnection();

    $where = [];
    $params = [];

    if (!empty($_GET['status'])) {
        $where[] = 'a.status = :status';
        $params[':status'] = trim($_GET['status']);
    }

    if (!empty($_GET['severity'])) {
        $where[] = 'a.severity = :severity';
        $params[':severity'] = trim($_GET['severity']);
    }

    if (!empty($_GET['alert_type'])) {
        $where[] = 'a.alert_type = :alert_type';
        $params[':alert_type'] = trim($_GET['alert_type']);
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT a.*, u.full_name AS assigned_officer, u.designation AS officer_designation
        FROM alerts a
        LEFT JOIN users u ON a.assigned_to = u.id
        $whereClause
        ORDER BY 
            CASE a.severity
                WHEN 'Critical' THEN 1
                WHEN 'High' THEN 2
                WHEN 'Medium' THEN 3
                ELSE 4
            END,
            a.created_at DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $alerts = $stmt->fetchAll();

    Response::success('Alerts retrieved successfully', $alerts);
} catch (Exception $e) {
    Response::error('Failed to retrieve alerts: ' . $e->getMessage(), [], 500);
}
