<?php
/**
 * ATITHYA360 – API: List Guests
 * GET /api/guests/list.php
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

    // Scope check: Property Owner/Staff can only see guests who have stayed at their property
    if (in_array($authUser['role_slug'], ['property_owner', 'property_staff'], true) && !empty($authUser['property_id'])) {
        $where[] = 'g.id IN (SELECT DISTINCT guest_id FROM stays WHERE property_id = :auth_prop_id)';
        $params[':auth_prop_id'] = (int)$authUser['property_id'];
    }

    if (!empty($_GET['search'])) {
        $search = '%' . trim($_GET['search']) . '%';
        $where[] = '(g.full_name LIKE :search OR g.guest_code LIKE :search OR g.mobile LIKE :search OR g.email LIKE :search OR g.passport_number LIKE :search)';
        $params[':search'] = $search;
    }

    if (!empty($_GET['guest_type'])) {
        $where[] = 'g.guest_type = :guest_type';
        $params[':guest_type'] = trim($_GET['guest_type']);
    }

    if (!empty($_GET['nationality'])) {
        $where[] = 'g.nationality = :nationality';
        $params[':nationality'] = trim($_GET['nationality']);
    }

    if (!empty($_GET['country_id'])) {
        $where[] = 'g.country_id = :country_id';
        $params[':country_id'] = (int)$_GET['country_id'];
    }

    if (!empty($_GET['purpose'])) {
        $where[] = 'g.purpose_of_visit = :purpose';
        $params[':purpose'] = trim($_GET['purpose']);
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(5, (int)($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    // Count
    $countSql = "SELECT COUNT(*) AS total FROM guests g $whereClause";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalRecords = (int)$countStmt->fetch()['total'];

    // Data
    $sql = "
        SELECT g.*, c.name AS country_name, s.name AS state_name,
               (SELECT COUNT(*) FROM stays st WHERE st.guest_id = g.id) AS total_stays,
               (SELECT st.stay_status FROM stays st WHERE st.guest_id = g.id ORDER BY st.checkin_time DESC LIMIT 1) AS latest_stay_status,
               (SELECT p.name FROM stays st JOIN properties p ON st.property_id = p.id WHERE st.guest_id = g.id ORDER BY st.checkin_time DESC LIMIT 1) AS latest_property_name
        FROM guests g
        LEFT JOIN countries c ON g.country_id = c.id
        LEFT JOIN states s ON g.state_id = s.id
        $whereClause
        ORDER BY g.id DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $db->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $guests = $stmt->fetchAll();

    Response::success('Guests retrieved successfully', [
        'guests'      => $guests,
        'total'       => $totalRecords,
        'page'        => $page,
        'limit'       => $limit,
        'total_pages' => ceil($totalRecords / $limit)
    ]);
} catch (Exception $e) {
    Response::error('Failed to retrieve guests: ' . $e->getMessage(), [], 500);
}
