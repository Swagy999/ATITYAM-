<?php
/**
 * ATITHYA360 – API: Monthly Visitor Velocity Trends & Forecasting
 * GET /api/analytics/monthly.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = Auth::authenticate();

// Provide 12-month synthetic & transactional velocity curve
$monthlyTrend = [
    ['month' => 'Oct 2025', 'indian' => 11200, 'foreign' => 2400, 'total' => 13600, 'occupancy' => 62],
    ['month' => 'Nov 2025', 'indian' => 13500, 'foreign' => 3100, 'total' => 16600, 'occupancy' => 71],
    ['month' => 'Dec 2025', 'indian' => 18400, 'foreign' => 4800, 'total' => 23200, 'occupancy' => 88],
    ['month' => 'Jan 2026', 'indian' => 16200, 'foreign' => 4200, 'total' => 20400, 'occupancy' => 82],
    ['month' => 'Feb 2026', 'indian' => 14100, 'foreign' => 3600, 'total' => 17700, 'occupancy' => 74],
    ['month' => 'Mar 2026', 'indian' => 15300, 'foreign' => 3200, 'total' => 18500, 'occupancy' => 76],
    ['month' => 'Apr 2026', 'indian' => 12900, 'foreign' => 2100, 'total' => 15000, 'occupancy' => 64],
    ['month' => 'May 2026', 'indian' => 17800, 'foreign' => 1900, 'total' => 19700, 'occupancy' => 79],
    ['month' => 'Jun 2026', 'indian' => 16500, 'foreign' => 1700, 'total' => 18200, 'occupancy' => 75],
    ['month' => 'Jul 2026', 'indian' => 13200, 'foreign' => 1600, 'total' => 14800, 'occupancy' => 61],
    ['month' => 'Aug 2026', 'indian' => 14800, 'foreign' => 2200, 'total' => 17000, 'occupancy' => 68],
    ['month' => 'Sep 2026', 'indian' => 19400, 'foreign' => 3900, 'total' => 23300, 'occupancy' => 85]
];

Response::success('Monthly visitor analytics retrieved', [
    'trends'            => $monthlyTrend,
    'annual_total'      => 218000,
    'peak_month'        => 'Sep 2026',
    'average_occupancy' => 73.8
]);
