<?php
/**
 * ATITHYA360 – Standard API JSON Response Helper
 */

class Response {
    public static function json(bool $success, string $message, $data = null, int $statusCode = 200, array $errors = []): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success'   => $success,
            'message'   => $message,
            'timestamp' => date('Y-m-d H:i:s'),
            'data'      => $data
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success(string $message = 'Success', $data = null, int $statusCode = 200): void {
        self::json(true, $message, $data, $statusCode);
    }

    public static function error(string $message = 'Error', array $errors = [], int $statusCode = 400): void {
        self::json(false, $message, null, $statusCode, $errors);
    }

    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::json(false, $message, null, 401);
    }

    public static function forbidden(string $message = 'Access forbidden'): void {
        self::json(false, $message, null, 403);
    }

    public static function notFound(string $message = 'Resource not found'): void {
        self::json(false, $message, null, 404);
    }
}
