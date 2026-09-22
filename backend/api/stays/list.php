<?php
/**
 * ATITHYA360 – API: List Stays
 * GET /api/stays/list.php
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

    // Role-based scope
    if (in_array($authUser['role_slug'], ['property_owner', 'property_staff'], true) && !empty($authUser['property_id'])) {
        $where[] = 'st.property_id = :auth_prop_id';
        $params[':auth_prop_id'] = (int)$authUser['property_id'];
    } elseif ($authUser['role_slug'] === 'district_admin' && !empty($authUser['district_id'])) {
        $where[] = 'p.district_id = :auth_dist_id';
        $params[':auth_dist_id'] = (int)$authUser['district_id'];
    } elseif ($authUser['role_slug'] === 'police_officer' && !empty($authUser['police_station_id'])) {
        $where[] = 'p.police_station_id = :auth_ps_id';
        $params[':auth_ps_id'] = (int)$authUser['police_station_id'];
    }

    if (!empty($_GET['property_id'])) {
        $where[] = 'st.property_id = :property_id';
        $params[':property_id'] = (int)$_GET['property_id'];
    }

    if (!empty($_GET['stay_status'])) {
        $where[] = 'st.stay_status = :stay_status';
        $params[':stay_status'] = trim($_GET['stay_status']);
    }

    if (!empty($_GET['guest_type'])) {
        $where[] = 'g.guest_type = :guest_type';
        $params[':guest_type'] = trim($_GET['guest_type']);
    }

    if (!empty($_GET['search'])) {
        $search = '%' . trim($_GET['search']) . '%';
        $where[] = '(g.full_name LIKE :search OR g.guest_code LIKE :search OR st.stay_code LIKE :search OR p.name LIKE :search OR r.room_number LIKE :search)';
        $params[':search'] = $search;
    }

    if (!empty($_GET['date_from'])) {
        $where[] = 'DATE(st.checkin_time) >= :date_from';
        $params[':date_from'] = trim($_GET['date_from']);
    }

    if (!empty($_GET['date_to'])) {
        $where[] = 'DATE(st.checkin_time) <= :date_to';
        $params[':date_to'] = trim($_GET['date_to']);
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(5, (int)($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    // Count
    $countSql = "
        SELECT COUNT(*) AS total
        FROM stays st
        JOIN guests g ON st.guest_id = g.id
        JOIN properties p ON st.property_id = p.id
        JOIN rooms r ON st.room_id = r.id
        $whereClause
    ";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalRecords = (int)$countStmt->fetch()['total'];

    // Data
    $sql = "
        SELECT st.*, g.guest_code, g.full_name AS guest_name, g.guest_type, g.nationality, g.mobile AS guest_mobile,
               g.passport_number, g.visa_number, g.foreign_verification_status,
               p.name AS property_name, p.property_code, p.city AS property_city,
               r.room_number, r.room_type,
               d.name AS destination_name, ps.station_name
        FROM stays st
        JOIN guests g ON st.guest_id = g.id
        JOIN properties p ON st.property_id = p.id
        JOIN rooms r ON st.room_id = r.id
        LEFT JOIN destinations d ON st.primary_destination_id = d.id
        LEFT JOIN police_stations ps ON p.police_station_id = ps.id
        $whereClause
        ORDER BY st.checkin_time DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $db->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $stays = $stmt->fetchAll();

    Response::success('Stays retrieved successfully', [
        'stays'       => $stays,
        'total'       => $totalRecords,
        'page'        => $page,
        'limit'       => $limit,
        'total_pages' => ceil($totalRecords / $limit)
    ]);
} catch (Exception $e) {
    Response::error('Failed to list stays: ' . $e->getMessage(), [], 500);
}
