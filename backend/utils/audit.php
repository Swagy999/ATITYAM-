<?php
/**
 * ATITHYA360 – Security Audit Logging Utility
 */

require_once __DIR__ . '/../config/database.php';

class AuditLogger {
    public static function log(
        string $action,
        string $entity,
        ?string $entityId = null,
        ?string $details = null,
        ?int $userId = null,
        ?string $userEmail = null,
        ?string $userRole = null
    ): void {
        try {
            $db = Database::getConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
            }
            $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown Agent', 0, 255);

            $stmt = $db->prepare("
                INSERT INTO audit_logs (user_id, user_email, user_role, action, entity, entity_id, ip_address, user_agent, details, created_at)
                VALUES (:user_id, :user_email, :user_role, :action, :entity, :entity_id, :ip_address, :user_agent, :details, NOW())
            ");

            $stmt->execute([
                ':user_id'    => $userId,
                ':user_email' => $userEmail,
                ':user_role'  => $userRole,
                ':action'     => $action,
                ':entity'     => $entity,
                ':entity_id'  => $entityId,
                ':ip_address' => $ip,
                ':user_agent' => $userAgent,
                ':details'    => $details
            ]);
        } catch (Exception $e) {
            // Audit logging failures must not halt execution, but should be logged to system error log
            error_log("Audit Log Failed: " . $e->getMessage());
        }
    }
}
