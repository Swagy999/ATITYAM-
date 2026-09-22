<?php
/**
 * ATITHYA360 – API: Guest Details, Documents & Stay History
 * GET /api/guests/details.php?id={id}
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = Auth::authenticate();

$guestId = (int)($_GET['id'] ?? 0);
if ($guestId <= 0) {
    Response::error('Invalid or missing guest ID parameter.', [], 400);
}

try {
    $db = Database::getConnection();

    // Guest Profile
    $stmt = $db->prepare("
        SELECT g.*, c.name AS country_name, s.name AS state_name
        FROM guests g
        LEFT JOIN countries c ON g.country_id = c.id
        LEFT JOIN states s ON g.state_id = s.id
        WHERE g.id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $guestId]);
    $guest = $stmt->fetch();

    if (!$guest) {
        Response::notFound('Guest record not found.');
    }

    // Documents
    $docStmt = $db->prepare("SELECT * FROM guest_documents WHERE guest_id = :id ORDER BY uploaded_at DESC");
    $docStmt->execute([':id' => $guestId]);
    $documents = $docStmt->fetchAll();

    // Complete Stay History
    $stayStmt = $db->prepare("
        SELECT st.*, p.name AS property_name, p.property_code, p.city AS property_city,
               r.room_number, r.room_type, d.name AS destination_name
        FROM stays st
        JOIN properties p ON st.property_id = p.id
        JOIN rooms r ON st.room_id = r.id
        LEFT JOIN destinations d ON st.primary_destination_id = d.id
        WHERE st.guest_id = :id
        ORDER BY st.checkin_time DESC
    ");
    $stayStmt->execute([':id' => $guestId]);
    $stays = $stayStmt->fetchAll();

    AuditLogger::log('View Guest Record', 'Guest', (string)$guestId, "Accessed full stay history for {$guest['full_name']}", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Guest details retrieved successfully', [
        'guest'     => $guest,
        'documents' => $documents,
        'stays'     => $stays
    ]);
} catch (Exception $e) {
    Response::error('Failed to load guest details: ' . $e->getMessage(), [], 500);
}
