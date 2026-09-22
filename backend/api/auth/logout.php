<?php
/**
 * ATITHYA360 – API: Auth Logout & Audit
 * POST /api/auth/logout.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

$token = Auth::getBearerToken();
if ($token) {
    $payload = Auth::verifyToken($token);
    if ($payload) {
        AuditLogger::log('Logout', 'User', (string)$payload['id'], 'User session terminated gracefully', $payload['id'], $payload['email'], $payload['role_slug']);
    }
}

Response::success('Logged out successfully.');
