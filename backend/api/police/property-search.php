<?php
/**
 * ATITHYA360 – API: Police Property Jurisdiction Search & Compliance
 * GET /api/police/property-search.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'district_admin', 'police_admin', 'police_officer']);

try {
    $db = Database::getConnection();

    $where = [];
    $params = [];

    if ($authUser['role_slug'] === 'police_officer' && !empty($authUser['police_station_id'])) {
        $where[] = 'p.police_station_id = :auth_ps_id';
        $params[':auth_ps_id'] = (int)$authUser['police_station_id'];
    }

    if (!empty($_GET['query'])) {
        $q = '%' . trim($_GET['query']) . '%';
        $where[] = '(p.name LIKE :q OR p.property_code LIKE :q OR p.owner_name LIKE :q OR p.license_number LIKE :q OR p.registration_number LIKE :q)';
        $params[':q'] = $q;
    }

    if (!empty($_GET['status'])) {
        $where[] = 'p.status = :status';
        $params[':status'] = trim($_GET['status']);
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT p.*, ps.station_name, ps.station_code, d.name AS district_name, s.name AS state_name,
               (SELECT COUNT(*) FROM stays st WHERE st.property_id = p.id AND st.stay_status = 'Checked In') AS active_guests,
               (SELECT COUNT(*) FROM stays st JOIN guests g ON st.guest_id = g.id WHERE st.property_id = p.id AND st.stay_status = 'Checked In' AND g.guest_type = 'Foreign Visitor') AS active_foreigners
        FROM properties p
        LEFT JOIN police_stations ps ON p.police_station_id = ps.id
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN states s ON p.state_id = s.id
        $whereClause
        ORDER BY p.name ASC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $properties = $stmt->fetchAll();

    AuditLogger::log('Police Property Registry Search', 'Property', 'REGISTRY_QUERY', "Queried property inspection registry", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Property registry search retrieved', [
        'count'      => count($properties),
        'properties' => $properties
    ]);
} catch (Exception $e) {
    Response::error('Property inspection query failed: ' . $e->getMessage(), [], 500);
}
