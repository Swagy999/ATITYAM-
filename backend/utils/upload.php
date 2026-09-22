<?php
/**
 * ATITHYA360 – Secure Document Upload Handler
 */

require_once __DIR__ . '/../config/config.php';

class Uploader {
    private static array $allowedMimeTypes = [
        'application/pdf' => 'pdf',
        'image/jpeg'      => 'jpg',
        'image/png'       => 'png',
        'image/webp'      => 'webp'
    ];

    private static int $maxSizeBytes = 10 * 1024 * 1024; // 10 MB

    public static function handleUpload(array $file, string $subDirectory = 'documents'): array {
        if (!isset($file['error']) || is_array($file['error'])) {
            return ['success' => false, 'error' => 'Invalid upload parameters.'];
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors = [
                UPLOAD_ERR_INI_SIZE   => 'Uploaded file exceeds server limit.',
                UPLOAD_ERR_FORM_SIZE  => 'Uploaded file exceeds form limit.',
                UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded.',
                UPLOAD_ERR_NO_FILE    => 'No file was selected for upload.',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder.',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
                UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload.'
            ];
            return ['success' => false, 'error' => $errors[$file['error']] ?? 'Unknown upload error.'];
        }

        if ($file['size'] > self::$maxSizeBytes) {
            return ['success' => false, 'error' => 'File size exceeds 10MB maximum limit.'];
        }

        // Verify MIME type using finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mime, self::$allowedMimeTypes)) {
            return ['success' => false, 'error' => 'Unsupported file format. Only PDF, JPG, PNG and WebP are allowed.'];
        }

        $extension = self::$allowedMimeTypes[$mime];
        $targetDir = APP_ROOT . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $subDirectory;

        if (!is_dir($targetDir)) {
            if (!@mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
                return ['success' => false, 'error' => 'Failed to create upload storage directory.'];
            }
        }

        // Generate safe random unique filename (prevents directory traversal and executable execution)
        $uniqueName = 'doc_' . bin2hex(random_bytes(12)) . '_' . time() . '.' . $extension;
        $targetFilePath = $targetDir . DIRECTORY_SEPARATOR . $uniqueName;
        $relativeFilePath = 'uploads/' . $subDirectory . '/' . $uniqueName;

        if (!move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            return ['success' => false, 'error' => 'Could not save file to disk.'];
        }

        return [
            'success'       => true,
            'file_name'     => $uniqueName,
            'original_name' => basename($file['name']),
            'mime_type'     => $mime,
            'size'          => $file['size'],
            'relative_path' => $relativeFilePath,
            'full_path'     => $targetFilePath
        ];
    }
}
