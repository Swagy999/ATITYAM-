<?php
/**
 * ATITHYA360 – API: Verify Property (Admin & Police Authority Approval)
 * POST /api/properties/verify.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

// Only Authorities & Admins can change verification status
$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'district_admin', 'police_admin', 'police_officer']);
$input = Validator::getJsonInput();

$propertyId = (int)($input['property_id'] ?? 0);
$status = trim($input['status'] ?? '');
$notes = trim($input['verification_notes'] ?? '');

if ($propertyId <= 0 || !in_array($status, ['Verified', 'Pending', 'Rejected', 'Suspended', 'Active'], true)) {
    Response::error('Invalid property ID or status option provided.', [], 422);
}

try {
    $db = Database::getConnection();

    $stmt = $db->prepare("
        UPDATE properties
        SET status = :status,
            verification_notes = :notes,
            verified_by = :verified_by,
            verified_at = NOW()
        WHERE id = :id
    ");

    $stmt->execute([
        ':status'      => $status,
        ':notes'       => $notes,
        ':verified_by' => $authUser['id'],
        ':id'          => $propertyId
    ]);

    AuditLogger::log('Verify Property', 'Property', (string)$propertyId, "Property status changed to '$status' by {$authUser['role_name']}. Notes: $notes", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success("Property verification status successfully updated to '$status'.", [
        'property_id' => $propertyId,
        'status'      => $status,
        'verified_at' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    Response::error('Property verification update failed: ' . $e->getMessage(), [], 500);
}
