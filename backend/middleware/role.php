<?php
/**
 * ATITHYA360 – Role-Based Access Control (RBAC) Middleware
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../utils/response.php';

class RoleMiddleware {
    /**
     * Authorize user if their role slug is in the allowed list
     */
    public static function authorize(array $allowedRoles): array {
        $user = Auth::authenticate();
        $userRole = $user['role_slug'] ?? '';

        // Super Admin has global bypass privilege
        if ($userRole === 'super_admin') {
            return $user;
        }

        if (!in_array($userRole, $allowedRoles, true)) {
            Response::forbidden("Access denied: You do not possess the required permissions for this resource.");
        }

        return $user;
    }

    /**
     * Enforce Property Ownership or Property Staff match
     */
    public static function enforcePropertyAccess(array $user, int $requestedPropertyId): void {
        if ($user['role_slug'] === 'super_admin' || $user['role_slug'] === 'state_admin') {
            return;
        }

        if (in_array($user['role_slug'], ['property_owner', 'property_staff'], true)) {
            $userPropId = (int)($user['property_id'] ?? 0);
            if ($userPropId !== $requestedPropertyId && $userPropId !== 0) {
                Response::forbidden("Unauthorized: You may only access records belonging to your assigned property.");
            }
        }
    }
}
