<?php
/**
 * ATITHYA360 – API: State-wise and District-wise Tourism Distribution
 * GET /api/analytics/state-wise.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = Auth::authenticate();

$stateData = [
    ['state' => 'West Bengal', 'visitors' => 45200, 'properties' => 320, 'share' => 20.7],
    ['state' => 'Odisha', 'visitors' => 38100, 'properties' => 240, 'share' => 17.5],
    ['state' => 'Rajasthan', 'visitors' => 34500, 'properties' => 290, 'share' => 15.8],
    ['state' => 'Himachal Pradesh', 'visitors' => 29400, 'properties' => 210, 'share' => 13.5],
    ['state' => 'Goa', 'visitors' => 26800, 'properties' => 380, 'share' => 12.3],
    ['state' => 'Kerala', 'visitors' => 22900, 'properties' => 195, 'share' => 10.5],
    ['state' => 'Uttarakhand', 'visitors' => 12300, 'properties' => 140, 'share' => 5.6],
    ['state' => 'Maharashtra', 'visitors' => 8800, 'properties' => 110, 'share' => 4.1]
];

$districtData = [
    ['district' => 'Kolkata', 'state' => 'West Bengal', 'visitors' => 28400, 'properties' => 180],
    ['district' => 'Darjeeling', 'state' => 'West Bengal', 'visitors' => 16800, 'properties' => 140],
    ['district' => 'Puri', 'state' => 'Odisha', 'visitors' => 24500, 'properties' => 150],
    ['district' => 'Jaipur', 'state' => 'Rajasthan', 'visitors' => 21200, 'properties' => 165],
    ['district' => 'Udaipur', 'state' => 'Rajasthan', 'visitors' => 13300, 'properties' => 125],
    ['district' => 'Shimla', 'state' => 'Himachal Pradesh', 'visitors' => 15100, 'properties' => 110],
    ['district' => 'Kullu (Manali)', 'state' => 'Himachal Pradesh', 'visitors' => 14300, 'properties' => 100],
    ['district' => 'North Goa', 'state' => 'Goa', 'visitors' => 18900, 'properties' => 220],
    ['district' => 'Ernakulam (Kochi)', 'state' => 'Kerala', 'visitors' => 13200, 'properties' => 105]
];

Response::success('State and district distribution analytics retrieved', [
    'states'    => $stateData,
    'districts' => $districtData
]);
