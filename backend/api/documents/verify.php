<?php
/**
 * ATITHYA360 – API: Document Verification Status Update
 * POST /api/documents/verify.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

// Only authorized officers & admins can verify documents
$authUser = RoleMiddleware::authorize(['super_admin', 'state_admin', 'district_admin', 'police_admin', 'police_officer']);
$input = Validator::getJsonInput();

$docId = (int)($input['document_id'] ?? 0);
$status = trim($input['status'] ?? 'Verified');

if ($docId <= 0 || !in_array($status, ['Verified', 'Pending', 'Rejected', 'Needs Review'], true)) {
    Response::error('Invalid document ID or verification status.', [], 422);
}

try {
    $db = Database::getConnection();

    $stmt = $db->prepare("
        UPDATE guest_documents
        SET verification_status = :status,
            verified_at = NOW(),
            verified_by = :verified_by
        WHERE id = :id
    ");

    $stmt->execute([
        ':status'      => $status,
        ':verified_by' => $authUser['id'],
        ':id'          => $docId
    ]);

    AuditLogger::log('Verify Document', 'GuestDocument', (string)$docId, "Document verification status updated to $status", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success("Document verification updated to $status.");
} catch (Exception $e) {
    Response::error('Failed to verify document: ' . $e->getMessage(), [], 500);
}
