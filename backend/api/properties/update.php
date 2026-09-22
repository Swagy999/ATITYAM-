<?php
/**
 * ATITHYA360 – API: Update Property
 * PUT / POST /api/properties/update.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$authUser = Auth::authenticate();
$input = Validator::getJsonInput();

$propertyId = (int)($input['id'] ?? $_GET['id'] ?? 0);
if ($propertyId <= 0) {
    Response::error('Invalid or missing property ID.', [], 400);
}

// Scope check
RoleMiddleware::enforcePropertyAccess($authUser, $propertyId);

try {
    $db = Database::getConnection();

    $fields = ['name', 'property_type', 'owner_name', 'contact_number', 'email', 'address', 'city', 'pincode', 'license_number', 'registration_number', 'room_capacity', 'contact_person'];
    $updates = [];
    $params = [':id' => $propertyId];

    foreach ($fields as $f) {
        if (isset($input[$f])) {
            $updates[] = "$f = :$f";
            $params[":$f"] = $input[$f];
        }
    }

    if (empty($updates)) {
        Response::error('No update parameters were provided.', [], 400);
    }

    $sql = "UPDATE properties SET " . implode(', ', $updates) . " WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    AuditLogger::log('Update Property', 'Property', (string)$propertyId, 'Property details updated', $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Property information updated successfully.');
} catch (Exception $e) {
    Response::error('Failed to update property: ' . $e->getMessage(), [], 500);
}
