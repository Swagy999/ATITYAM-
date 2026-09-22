<?php
/**
 * ATITHYA360 – API: Current Profile & Identity Info
 * GET /api/auth/me.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = Auth::authenticate();

try {
    $db = Database::getConnection();
    $stmt = $db->prepare("
        SELECT u.id, u.role_id, u.full_name, u.email, u.mobile, u.designation,
               u.state_id, u.district_id, u.police_station_id, u.property_id, u.status, u.last_login,
               r.name AS role_name, r.slug AS role_slug,
               p.name AS property_name, p.property_code, p.property_type,
               s.name AS state_name, d.name AS district_name, ps.station_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN properties p ON u.property_id = p.id
        LEFT JOIN states s ON u.state_id = s.id
        LEFT JOIN districts d ON u.district_id = d.id
        LEFT JOIN police_stations ps ON u.police_station_id = ps.id
        WHERE u.id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $authUser['id']]);
    $profile = $stmt->fetch();

    if (!$profile) {
        Response::notFound('User profile could not be found.');
    }

    Response::success('Profile retrieved successfully', $profile);
} catch (Exception $e) {
    Response::error('Failed to retrieve user profile: ' . $e->getMessage(), [], 500);
}
