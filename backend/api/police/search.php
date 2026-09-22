<?php
/**
 * ATITHYA360 – API: Police / Authorized Authority Guest Search
 * GET /api/police/search.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

// Authorized Roles Only
$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'district_admin', 'police_admin', 'police_officer']);

try {
    $db = Database::getConnection();

    $where = [];
    $params = [];

    // Filter by Police Station jurisdiction if Station Officer
    if ($authUser['role_slug'] === 'police_officer' && !empty($authUser['police_station_id'])) {
        $where[] = 'p.police_station_id = :auth_ps_id';
        $params[':auth_ps_id'] = (int)$authUser['police_station_id'];
    }

    if (!empty($_GET['query'])) {
        $q = '%' . trim($_GET['query']) . '%';
        $where[] = '(g.full_name LIKE :q OR g.mobile LIKE :q OR g.passport_number LIKE :q OR g.guest_code LIKE :q OR st.stay_code LIKE :q OR p.name LIKE :q)';
        $params[':q'] = $q;
    }

    if (!empty($_GET['guest_type'])) {
        $where[] = 'g.guest_type = :guest_type';
        $params[':guest_type'] = trim($_GET['guest_type']);
    }

    if (!empty($_GET['nationality'])) {
        $where[] = 'g.nationality = :nationality';
        $params[':nationality'] = trim($_GET['nationality']);
    }

    if (!empty($_GET['stay_status'])) {
        $where[] = 'st.stay_status = :stay_status';
        $params[':stay_status'] = trim($_GET['stay_status']);
    }

    if (!empty($_GET['police_station_id'])) {
        $where[] = 'p.police_station_id = :police_station_id';
        $params[':police_station_id'] = (int)$_GET['police_station_id'];
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT st.id AS stay_id, st.stay_code, st.checkin_time, st.expected_checkout, st.actual_checkout, st.stay_status,
               g.id AS guest_id, g.guest_code, g.full_name, g.guest_type, g.dob, g.gender, g.mobile, g.email,
               g.nationality, g.address AS guest_address, g.city AS guest_city, g.emergency_contact, g.purpose_of_visit,
               g.passport_number, g.visa_number, g.visa_type, g.foreign_verification_status,
               p.id AS property_id, p.name AS property_name, p.property_code, p.property_type, p.owner_name, p.contact_number AS property_contact,
               p.address AS property_address, p.city AS property_city,
               r.room_number, r.room_type,
               ps.station_name, ps.station_code, d.name AS district_name, s.name AS state_name
        FROM stays st
        JOIN guests g ON st.guest_id = g.id
        JOIN properties p ON st.property_id = p.id
        JOIN rooms r ON st.room_id = r.id
        LEFT JOIN police_stations ps ON p.police_station_id = ps.id
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN states s ON p.state_id = s.id
        $whereClause
        ORDER BY st.checkin_time DESC
        LIMIT 100
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

    // Audit Search Query
    $searchQuerySummary = $_GET['query'] ?? 'ALL_AUTHORIZED';
    AuditLogger::log('Police Guest Search', 'Guest', 'SEARCH', "Search query executed for term: $searchQuerySummary. Returned " . count($results) . " records.", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Authorized police search executed', [
        'results_count' => count($results),
        'results'       => $results
    ]);
} catch (Exception $e) {
    Response::error('Search execution failed: ' . $e->getMessage(), [], 500);
}
