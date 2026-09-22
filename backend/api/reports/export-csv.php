<?php
/**
 * ATITHYA360 – API: Export Report to CSV Format
 * GET /api/reports/export-csv.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = Auth::authenticate();

try {
    $db = Database::getConnection();

    $where = [];
    $params = [];

    if (!empty($_GET['state_id'])) {
        $where[] = 'p.state_id = :state_id';
        $params[':state_id'] = (int)$_GET['state_id'];
    }

    if (!empty($_GET['district_id'])) {
        $where[] = 'p.district_id = :district_id';
        $params[':district_id'] = (int)$_GET['district_id'];
    }

    if (!empty($_GET['guest_type'])) {
        $where[] = 'g.guest_type = :guest_type';
        $params[':guest_type'] = trim($_GET['guest_type']);
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "
        SELECT st.stay_code, st.checkin_time, st.expected_checkout, st.actual_checkout, st.stay_status,
               g.guest_code, g.full_name AS guest_name, g.guest_type, g.nationality, g.gender, g.mobile,
               g.passport_number, g.visa_number,
               p.name AS property_name, p.property_code, p.city, s.name AS state_name, d.name AS district_name,
               r.room_number, r.room_type
        FROM stays st
        JOIN guests g ON st.guest_id = g.id
        JOIN properties p ON st.property_id = p.id
        JOIN rooms r ON st.room_id = r.id
        LEFT JOIN states s ON p.state_id = s.id
        LEFT JOIN districts d ON p.district_id = d.id
        $whereClause
        ORDER BY st.checkin_time DESC
        LIMIT 1000
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    AuditLogger::log('Export CSV Report', 'Report', 'CSV_EXPORT', "Exported " . count($rows) . " stay records", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="ATITHYA360_Tourism_Report_' . date('Ymd_His') . '.csv"');

    $output = fopen('php://output', 'w');

    // CSV Header
    fputcsv($output, [
        'Stay Code', 'Check-In', 'Expected Check-Out', 'Actual Check-Out', 'Status',
        'Guest Code', 'Guest Name', 'Guest Type', 'Nationality', 'Gender', 'Mobile',
        'Passport', 'Visa', 'Property Name', 'Property Code', 'City', 'State', 'District', 'Room', 'Room Type'
    ]);

    foreach ($rows as $row) {
        fputcsv($output, [
            $row['stay_code'],
            $row['checkin_time'],
            $row['expected_checkout'],
            $row['actual_checkout'] ?? 'N/A',
            $row['stay_status'],
            $row['guest_code'],
            $row['guest_name'],
            $row['guest_type'],
            $row['nationality'],
            $row['gender'],
            $row['mobile'],
            $row['passport_number'] ?? 'N/A',
            $row['visa_number'] ?? 'N/A',
            $row['property_name'],
            $row['property_code'],
            $row['city'],
            $row['state_name'],
            $row['district_name'],
            $row['room_number'],
            $row['room_type']
        ]);
    }

    fclose($output);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo "Export error: " . $e->getMessage();
    exit;
}
