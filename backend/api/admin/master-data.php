<?php
/**
 * ATITHYA360 – API: Master Reference Data (States, Districts, Police Stations, Destinations, Countries, Roles)
 * GET /api/admin/master-data.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

try {
    $db = Database::getConnection();

    $states = $db->query("SELECT id, name, state_code FROM states WHERE is_active = 1 ORDER BY name ASC")->fetchAll();
    $districts = $db->query("SELECT id, state_id, name, district_code FROM districts ORDER BY name ASC")->fetchAll();
    $policeStations = $db->query("SELECT id, district_id, station_name, station_code FROM police_stations ORDER BY station_name ASC")->fetchAll();
    $destinations = $db->query("SELECT id, district_id, name, category, is_popular FROM destinations ORDER BY name ASC")->fetchAll();
    $countries = $db->query("SELECT id, iso_code, name, phone_code FROM countries WHERE is_active = 1 ORDER BY name ASC")->fetchAll();
    $roles = $db->query("SELECT id, name, slug, description FROM roles ORDER BY id ASC")->fetchAll();

    Response::success('Master reference data loaded', [
        'states'          => $states,
        'districts'       => $districts,
        'police_stations' => $policeStations,
        'destinations'    => $destinations,
        'countries'       => $countries,
        'roles'           => $roles
    ]);
} catch (Exception $e) {
    Response::error('Failed to load master reference data: ' . $e->getMessage(), [], 500);
}
