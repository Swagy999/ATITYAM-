<?php
/**
 * ATITHYA360 – API: Property Details, Rooms & Stay History
 * GET /api/properties/details.php?id={id}
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = Auth::authenticate();

$propertyId = (int)($_GET['id'] ?? 0);
if ($propertyId <= 0) {
    Response::error('Invalid or missing property ID parameter.', [], 400);
}

// Role Scope Enforcement
RoleMiddleware::enforcePropertyAccess($authUser, $propertyId);

try {
    $db = Database::getConnection();

    // Property Profile
    $stmt = $db->prepare("
        SELECT p.*, s.name AS state_name, d.name AS district_name, ps.station_name, ps.contact_number AS ps_contact,
               u.full_name AS registered_owner, u.email AS owner_account_email
        FROM properties p
        LEFT JOIN states s ON p.state_id = s.id
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN police_stations ps ON p.police_station_id = ps.id
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $propertyId]);
    $property = $stmt->fetch();

    if (!$property) {
        Response::notFound('Property record not found.');
    }

    // Rooms
    $roomStmt = $db->prepare("SELECT * FROM rooms WHERE property_id = :id ORDER BY room_number ASC");
    $roomStmt->execute([':id' => $propertyId]);
    $rooms = $roomStmt->fetchAll();

    // Active Stays
    $stayStmt = $db->prepare("
        SELECT st.*, g.guest_code, g.full_name AS guest_name, g.guest_type, g.nationality, g.mobile AS guest_mobile,
               r.room_number, r.room_type
        FROM stays st
        JOIN guests g ON st.guest_id = g.id
        JOIN rooms r ON st.room_id = r.id
        WHERE st.property_id = :id AND st.stay_status = 'Checked In'
        ORDER BY st.checkin_time DESC
    ");
    $stayStmt->execute([':id' => $propertyId]);
    $activeStays = $stayStmt->fetchAll();

    // Documents
    $docStmt = $db->prepare("SELECT * FROM property_documents WHERE property_id = :id ORDER BY uploaded_at DESC");
    $docStmt->execute([':id' => $propertyId]);
    $documents = $docStmt->fetchAll();

    AuditLogger::log('View Property Details', 'Property', (string)$propertyId, "Viewed property details: {$property['name']}", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Property details retrieved successfully', [
        'property'      => $property,
        'rooms'         => $rooms,
        'active_stays'  => $activeStays,
        'documents'     => $documents
    ]);
} catch (Exception $e) {
    Response::error('Failed to load property details: ' . $e->getMessage(), [], 500);
}
