<?php
/**
 * ATITHYA360 – Authentication & JWT Token Middleware
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/response.php';

class Auth {
    /**
     * Create HMAC-SHA256 signed JWT token
     */
    public static function generateToken(array $payload): string {
        $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;
        $payloadEncoded = base64_encode(json_encode($payload));
        $signature = hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true);
        $signatureEncoded = base64_encode($signature);

        return "$header.$payloadEncoded.$signatureEncoded";
    }

    /**
     * Decode and verify JWT token
     */
    public static function verifyToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($header, $payloadEncoded, $signatureEncoded) = $parts;
        $signature = base64_decode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payload = json_decode(base64_decode($payloadEncoded), true);
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    /**
     * Extract bearer token from Authorization header or Query param
     */
    public static function getBearerToken(): ?string {
        $headers = [];
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        }
        
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;
        if ($authHeader && preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
            return $matches[1];
        }

        if (!empty($_GET['token'])) {
            return $_GET['token'];
        }

        return null;
    }

    /**
     * Require Authenticated User
     */
    public static function authenticate(): array {
        $token = self::getBearerToken();
        if (!$token) {
            Response::unauthorized('Authentication token required. Please log in.');
        }

        $payload = self::verifyToken($token);
        if (!$payload) {
            Response::unauthorized('Session has expired or token is invalid. Please log in again.');
        }

        return $payload;
    }
}
