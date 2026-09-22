<?php
/**
 * ATITHYA360 – API: Destination Popularity & Footfall Intelligence
 * GET /api/analytics/destination.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = Auth::authenticate();

try {
    $db = Database::getConnection();

    $stmt = $db->query("
        SELECT d.*, s.name AS state_name, dt.name AS district_name
        FROM destinations d
        JOIN districts dt ON d.district_id = dt.id
        JOIN states s ON dt.state_id = s.id
        ORDER BY d.annual_visitors_estimate DESC
    ");
    $destinations = $stmt->fetchAll();

    $categoryStats = [
        ['category' => 'Beach & Coastal', 'score' => 88, 'growth' => '+14.2%'],
        ['category' => 'Heritage & Culture', 'score' => 82, 'growth' => '+9.8%'],
        ['category' => 'Hill Station & Nature', 'score' => 79, 'growth' => '+11.5%'],
        ['category' => 'Pilgrimage & Spiritual', 'score' => 75, 'growth' => '+7.1%'],
        ['category' => 'Urban & Business', 'score' => 64, 'growth' => '+4.3%']
    ];

    Response::success('Destination intelligence retrieved', [
        'destinations'   => $destinations,
        'category_stats' => $categoryStats
    ]);
} catch (Exception $e) {
    Response::error('Failed to load destination analytics: ' . $e->getMessage(), [], 500);
}
