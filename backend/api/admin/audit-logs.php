<?php
/**
 * ATITHYA360 – API: System Security Audit Logs
 * GET /api/admin/audit-logs.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'police_admin']);

try {
    $db = Database::getConnection();

    $where = [];
    $params = [];

    if (!empty($_GET['action'])) {
        $where[] = 'action LIKE :action';
        $params[':action'] = '%' . trim($_GET['action']) . '%';
    }

    if (!empty($_GET['entity'])) {
        $where[] = 'entity = :entity';
        $params[':entity'] = trim($_GET['entity']);
    }

    if (!empty($_GET['user_email'])) {
        $where[] = 'user_email LIKE :user_email';
        $params[':user_email'] = '%' . trim($_GET['user_email']) . '%';
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(10, (int)($_GET['limit'] ?? 25)));
    $offset = ($page - 1) * $limit;

    $countStmt = $db->prepare("SELECT COUNT(*) AS total FROM audit_logs $whereClause");
    $countStmt->execute($params);
    $totalRecords = (int)$countStmt->fetch()['total'];

    $sql = "SELECT * FROM audit_logs $whereClause ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    $stmt = $db->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $logs = $stmt->fetchAll();

    Response::success('Audit logs retrieved', [
        'logs'        => $logs,
        'total'       => $totalRecords,
        'page'        => $page,
        'limit'       => $limit,
        'total_pages' => ceil($totalRecords / $limit)
    ]);
} catch (Exception $e) {
    Response::error('Failed to load audit logs: ' . $e->getMessage(), [], 500);
}
