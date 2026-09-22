<?php
/**
 * ATITHYA360 – API: Users List
 * GET /api/users/list.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'district_admin', 'police_admin', 'property_owner']);

try {
    $db = Database::getConnection();

    $where = [];
    $params = [];

    // Role-based scope
    if ($authUser['role_slug'] === 'property_owner') {
        $where[] = 'u.property_id = :prop_id';
        $params[':prop_id'] = (int)$authUser['property_id'];
    }

    if (!empty($_GET['role_id'])) {
        $where[] = 'u.role_id = :role_id';
        $params[':role_id'] = (int)$_GET['role_id'];
    }

    if (!empty($_GET['search'])) {
        $s = '%' . trim($_GET['search']) . '%';
        $where[] = '(u.full_name LIKE :s OR u.email LIKE :s OR u.mobile LIKE :s)';
        $params[':s'] = $s;
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT u.id, u.role_id, u.full_name, u.email, u.mobile, u.designation,
               u.state_id, u.district_id, u.police_station_id, u.property_id, u.status, u.last_login, u.created_at,
               r.name AS role_name, r.slug AS role_slug,
               p.name AS property_name, s.name AS state_name, d.name AS district_name, ps.station_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN properties p ON u.property_id = p.id
        LEFT JOIN states s ON u.state_id = s.id
        LEFT JOIN districts d ON u.district_id = d.id
        LEFT JOIN police_stations ps ON u.police_station_id = ps.id
        $whereClause
        ORDER BY u.id DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll();

    Response::success('Users list retrieved', $users);
} catch (Exception $e) {
    Response::error('Failed to load users: ' . $e->getMessage(), [], 500);
}
