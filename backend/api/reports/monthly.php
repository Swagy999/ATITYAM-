<?php
/**
 * ATITHYA360 – API: Comprehensive Filterable Reports
 * GET /api/reports/monthly.php
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

    // Filters
    if (!empty($_GET['report_type'])) {
        $type = $_GET['report_type'];
        if ($type === 'foreign_only') {
            $where[] = "g.guest_type = 'Foreign Visitor'";
        } elseif ($type === 'indian_only') {
            $where[] = "g.guest_type = 'Indian Guest'";
        } elseif ($type === 'active_stays') {
            $where[] = "st.stay_status = 'Checked In'";
        } elseif ($type === 'completed_stays') {
            $where[] = "st.stay_status = 'Checked Out'";
        }
    }

    if (!empty($_GET['state_id'])) {
        $where[] = 'p.state_id = :state_id';
        $params[':state_id'] = (int)$_GET['state_id'];
    }

    if (!empty($_GET['district_id'])) {
        $where[] = 'p.district_id = :district_id';
        $params[':district_id'] = (int)$_GET['district_id'];
    }

    if (!empty($_GET['property_id'])) {
        $where[] = 'st.property_id = :property_id';
        $params[':property_id'] = (int)$_GET['property_id'];
    }

    if (!empty($_GET['nationality'])) {
        $where[] = 'g.nationality = :nationality';
        $params[':nationality'] = trim($_GET['nationality']);
    }

    if (!empty($_GET['gender'])) {
        $where[] = 'g.gender = :gender';
        $params[':gender'] = trim($_GET['gender']);
    }

    if (!empty($_GET['purpose'])) {
        $where[] = 'g.purpose_of_visit = :purpose';
        $params[':purpose'] = trim($_GET['purpose']);
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

    $sql = "
        SELECT st.id AS stay_id, st.stay_code, st.checkin_time, st.expected_checkout, st.actual_checkout, st.stay_status, st.num_guests,
               g.guest_code, g.full_name AS guest_name, g.guest_type, g.gender, g.dob, g.nationality, g.mobile, g.purpose_of_visit,
               g.passport_number, g.visa_number, g.foreign_verification_status,
               p.name AS property_name, p.property_code, p.property_type, p.city AS property_city,
               s.name AS state_name, d.name AS district_name, ps.station_name, r.room_number, r.room_type
        FROM stays st
        JOIN guests g ON st.guest_id = g.id
        JOIN properties p ON st.property_id = p.id
        JOIN rooms r ON st.room_id = r.id
        LEFT JOIN states s ON p.state_id = s.id
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN police_stations ps ON p.police_station_id = ps.id
        $whereClause
        ORDER BY st.checkin_time DESC
        LIMIT 500
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $records = $stmt->fetchAll();

    // Summary calculation
    $summary = [
        'total_records'    => count($records),
        'indian_guests'    => 0,
        'foreign_visitors' => 0,
        'active_stays'     => 0,
        'completed_stays'  => 0
    ];

    foreach ($records as $r) {
        if ($r['guest_type'] === 'Indian Guest') $summary['indian_guests']++;
        if ($r['guest_type'] === 'Foreign Visitor') $summary['foreign_visitors']++;
        if ($r['stay_status'] === 'Checked In') $summary['active_stays']++;
        if ($r['stay_status'] === 'Checked Out') $summary['completed_stays']++;
    }

    Response::success('Report generated successfully', [
        'summary' => $summary,
        'records' => $records
    ]);
} catch (Exception $e) {
    Response::error('Failed to generate report: ' . $e->getMessage(), [], 500);
}
