<?php
/**
 * ATITHYA360 – API: Update Guest Record
 * PUT / POST /api/guests/update.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = Auth::authenticate();
$input = Validator::getJsonInput();

$guestId = (int)($input['id'] ?? $_GET['id'] ?? 0);
if ($guestId <= 0) {
    Response::error('Invalid or missing guest ID parameter.', [], 400);
}

try {
    $db = Database::getConnection();

    $fields = ['full_name', 'dob', 'gender', 'mobile', 'email', 'nationality', 'address', 'city', 'state_id', 'country_id', 'emergency_contact', 'purpose_of_visit', 'passport_number', 'visa_number', 'visa_type', 'visa_expiry', 'port_of_entry', 'foreign_verification_status'];
    $updates = [];
    $params = [':id' => $guestId];

    foreach ($fields as $f) {
        if (isset($input[$f])) {
            $updates[] = "$f = :$f";
            $params[":$f"] = $input[$f];
        }
    }

    if (empty($updates)) {
        Response::error('No update parameters provided.', [], 400);
    }

    $sql = "UPDATE guests SET " . implode(', ', $updates) . " WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    AuditLogger::log('Update Guest Record', 'Guest', (string)$guestId, 'Guest metadata updated', $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Guest record updated successfully.');
} catch (Exception $e) {
    Response::error('Failed to update guest record: ' . $e->getMessage(), [], 500);
}
