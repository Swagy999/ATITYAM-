<?php
/**
 * ATITHYA360 – Configuration Settings
 * "Smarter Stays. Safer Destinations."
 */

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Base Paths
define('APP_ROOT', dirname(__DIR__));
define('UPLOAD_DIR', APP_ROOT . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'documents');

// Load environment variables if .env exists
$envFile = APP_ROOT . DIRECTORY_SEPARATOR . '.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim($val, " \t\n\r\0\x0B\"'");
            if (!array_key_exists($key, $_ENV)) {
                putenv("$key=$val");
                $_ENV[$key] = $val;
            }
        }
    }
}

// Database credentials
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'atithya360');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '');

// Security & JWT Config
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'atithya360_super_secret_enterprise_key_2026');
define('JWT_EXPIRY', 86400 * 7); // 7 days

// System Constants
define('APP_NAME', 'ATITHYA360');
define('APP_TAGLINE', 'Smarter Stays. Safer Destinations.');
define('APP_VERSION', '1.0.0-Demo');
