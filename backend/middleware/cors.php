<?php
/**
 * ATITHYA360 – Cross-Origin Resource Sharing (CORS) Middleware
 */

function handleCors(): void {
    // Permitted origins (Local dev Vite React + Production)
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");
    header("Access-Control-Max-Age: 86400");

    // Pre-flight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

// Automatically invoke on inclusion
handleCors();
