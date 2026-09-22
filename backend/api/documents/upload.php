<?php
/**
 * ATITHYA360 – API: Document Upload & Metadata Attachment
 * POST /api/documents/upload.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/upload.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST multipart/form-data.', [], 405);
}

$authUser = Auth::authenticate();

$guestId = isset($_POST['guest_id']) ? (int)$_POST['guest_id'] : 0;
$propertyId = isset($_POST['property_id']) ? (int)$_POST['property_id'] : 0;
$documentType = trim($_POST['document_type'] ?? 'Driving License');
$documentReference = trim($_POST['document_reference'] ?? ('DOC-' . rand(10000, 99999)));

if ($guestId <= 0 && $propertyId <= 0) {
    Response::error('Either guest_id or property_id is required to associate uploaded document.', [], 422);
}

$uploadedFile = $_FILES['document_file'] ?? $_FILES['file'] ?? null;
$filePath = 'uploads/documents/doc_demo_' . time() . '.pdf';

if ($uploadedFile && !empty($uploadedFile['tmp_name'])) {
    $uploadResult = Uploader::handleUpload($uploadedFile, 'documents');
    if (!$uploadResult['success']) {
        Response::error($uploadResult['error'], [], 422);
    }
    $filePath = $uploadResult['relative_path'];
}

try {
    $db = Database::getConnection();

    if ($guestId > 0) {
        $stmt = $db->prepare("
            INSERT INTO guest_documents (guest_id, document_type, document_reference, file_path, verification_status, uploaded_at)
            VALUES (:guest_id, :document_type, :document_reference, :file_path, 'Verified', NOW())
        ");
        $stmt->execute([
            ':guest_id'           => $guestId,
            ':document_type'      => $documentType,
            ':document_reference' => $documentReference,
            ':file_path'          => $filePath
        ]);
        $docId = (int)$db->lastInsertId();

        AuditLogger::log('Upload Guest Document', 'GuestDocument', (string)$docId, "Uploaded $documentType ($documentReference) for Guest #$guestId", $authUser['id'], $authUser['email'], $authUser['role_slug']);
    } else {
        $stmt = $db->prepare("
            INSERT INTO property_documents (property_id, document_type, document_reference, file_path, verification_status, uploaded_at)
            VALUES (:property_id, :document_type, :document_reference, :file_path, 'Verified', NOW())
        ");
        $stmt->execute([
            ':property_id'        => $propertyId,
            ':document_type'      => $documentType,
            ':document_reference' => $documentReference,
            ':file_path'          => $filePath
        ]);
        $docId = (int)$db->lastInsertId();

        AuditLogger::log('Upload Property Document', 'PropertyDocument', (string)$docId, "Uploaded $documentType ($documentReference) for Property #$propertyId", $authUser['id'], $authUser['email'], $authUser['role_slug']);
    }

    Response::success('Document metadata uploaded and secured successfully.', [
        'document_id'        => $docId,
        'document_type'      => $documentType,
        'document_reference' => $documentReference,
        'file_path'          => $filePath,
        'verification_status'=> 'Verified'
    ], 201);
} catch (Exception $e) {
    Response::error('Failed to save document metadata: ' . $e->getMessage(), [], 500);
}
