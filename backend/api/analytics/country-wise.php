<?php
/**
 * ATITHYA360 – API: Foreign Visitor Country Analysis
 * GET /api/analytics/country-wise.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

$authUser = Auth::authenticate();

$countryData = [
    ['country' => 'Bangladesh', 'iso' => 'BGD', 'visitors' => 9800, 'purpose' => 'Medical & Tourism', 'share' => 28.5],
    ['country' => 'United States', 'iso' => 'USA', 'visitors' => 6400, 'purpose' => 'Heritage & Business', 'share' => 18.6],
    ['country' => 'United Kingdom', 'iso' => 'GBR', 'visitors' => 5200, 'purpose' => 'Cultural Heritage', 'share' => 15.1],
    ['country' => 'Germany', 'iso' => 'DEU', 'visitors' => 3800, 'purpose' => 'Nature & Adventure', 'share' => 11.0],
    ['country' => 'France', 'iso' => 'FRA', 'visitors' => 2900, 'purpose' => 'Yoga & Culture', 'share' => 8.4],
    ['country' => 'Australia', 'iso' => 'AUS', 'visitors' => 2400, 'purpose' => 'Coastal & Wildlife', 'share' => 7.0],
    ['country' => 'Japan', 'iso' => 'JPN', 'visitors' => 1900, 'purpose' => 'Pilgrimage & Heritage', 'share' => 5.5],
    ['country' => 'Italy', 'iso' => 'ITA', 'visitors' => 1100, 'purpose' => 'Art & Architecture', 'share' => 3.2],
    ['country' => 'Canada', 'iso' => 'CAN', 'visitors' => 900, 'purpose' => 'Family & Leisure', 'share' => 2.7]
];

$purposeBreakdown = [
    ['purpose' => 'Tourism & Leisure', 'count' => 19500, 'percentage' => 56.7],
    ['purpose' => 'Business & MICE', 'count' => 5800, 'percentage' => 16.9],
    ['purpose' => 'Medical Tourism', 'count' => 4900, 'percentage' => 14.2],
    ['purpose' => 'Education & Research', 'count' => 2400, 'percentage' => 7.0],
    ['purpose' => 'Transit & Family', 'count' => 1800, 'percentage' => 5.2]
];

Response::success('Country and international origin analytics retrieved', [
    'countries' => $countryData,
    'purposes'  => $purposeBreakdown
]);
