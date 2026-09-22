<?php
/**
 * ATITHYA360 – Input Sanitizer and Validation Utility
 */

class Validator {
    public static function sanitize(array $input): array {
        $sanitized = [];
        foreach ($input as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = self::sanitize($value);
            } elseif (is_string($value)) {
                $sanitized[$key] = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
            } else {
                $sanitized[$key] = $value;
            }
        }
        return $sanitized;
    }

    public static function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return self::sanitize($decoded);
        }
        return self::sanitize($_POST);
    }

    public static function validateRequired(array $data, array $requiredFields): array {
        $missing = [];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
                $missing[] = $field;
            }
        }
        return $missing;
    }

    public static function isValidEmail(string $email): bool {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function isValidMobile(string $mobile): bool {
        // Permit domestic/international formats with + and spaces
        return preg_match('/^[+]?[0-9\s-]{8,20}$/', $mobile) === 1;
    }
}
