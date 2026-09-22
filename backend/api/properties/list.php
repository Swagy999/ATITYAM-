<?php
/**
 * ATITHYA360 – API: List Properties
 * GET /api/properties/list.php
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

    // Role-based scope restrictions
    if (in_array($authUser['role_slug'], ['property_owner', 'property_staff'], true)) {
        if (!empty($authUser['property_id'])) {
            $where[] = 'p.id = :auth_prop_id';
            $params[':auth_prop_id'] = (int)$authUser['property_id'];
        } else {
            $where[] = 'p.owner_id = :auth_owner_id';
            $params[':auth_owner_id'] = (int)$authUser['id'];
        }
    } elseif ($authUser['role_slug'] === 'district_admin' && !empty($authUser['district_id'])) {
        $where[] = 'p.district_id = :auth_dist_id';
        $params[':auth_dist_id'] = (int)$authUser['district_id'];
    } elseif ($authUser['role_slug'] === 'police_officer' && !empty($authUser['police_station_id'])) {
        $where[] = 'p.police_station_id = :auth_ps_id';
        $params[':auth_ps_id'] = (int)$authUser['police_station_id'];
    }

    // Query filters
    if (!empty($_GET['search'])) {
        $searchTerm = '%' . trim($_GET['search']) . '%';
        $where[] = '(p.name LIKE :search OR p.property_code LIKE :search OR p.city LIKE :search OR p.owner_name LIKE :search)';
        $params[':search'] = $searchTerm;
    }

    if (!empty($_GET['property_type'])) {
        $where[] = 'p.property_type = :property_type';
        $params[':property_type'] = trim($_GET['property_type']);
    }

    if (!empty($_GET['status'])) {
        $where[] = 'p.status = :status';
        $params[':status'] = trim($_GET['status']);
    }

    if (!empty($_GET['district_id'])) {
        $where[] = 'p.district_id = :district_id';
        $params[':district_id'] = (int)$_GET['district_id'];
    }

    if (!empty($_GET['state_id'])) {
        $where[] = 'p.state_id = :state_id';
        $params[':state_id'] = (int)$_GET['state_id'];
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(5, (int)($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    // Total Count
    $countSql = "SELECT COUNT(*) AS total FROM properties p $whereClause";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalRecords = (int)$countStmt->fetch()['total'];

    // Data query with joins
    $sql = "
        SELECT p.*, s.name AS state_name, d.name AS district_name, ps.station_name,
               (SELECT COUNT(*) FROM rooms r WHERE r.property_id = p.id) AS total_rooms,
               (SELECT COUNT(*) FROM stays st WHERE st.property_id = p.id AND st.stay_status = 'Checked In') AS active_guests
        FROM properties p
        LEFT JOIN states s ON p.state_id = s.id
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN police_stations ps ON p.police_station_id = ps.id
        $whereClause
        ORDER BY p.id DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $db->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $properties = $stmt->fetchAll();

    Response::success('Properties retrieved successfully', [
        'properties'    => $properties,
        'total'         => $totalRecords,
        'page'          => $page,
        'limit'         => $limit,
        'total_pages'   => ceil($totalRecords / $limit)
    ]);
} catch (Exception $e) {
    Response::error('Failed to retrieve properties: ' . $e->getMessage(), [], 500);
}
