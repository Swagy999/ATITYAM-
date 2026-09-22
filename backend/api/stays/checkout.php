<?php
/**
 * ATITHYA360 – API: Guest Check-Out
 * POST /api/stays/checkout.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../middleware/role.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/audit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed. Use POST.', [], 405);
}

$authUser = Auth::authenticate();
$input = Validator::getJsonInput();

$stayId = (int)($input['stay_id'] ?? 0);
if ($stayId <= 0) {
    Response::error('Invalid or missing stay ID.', [], 400);
}

try {
    $db = Database::getConnection();

    // Fetch active stay
    $stmt = $db->prepare("SELECT * FROM stays WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $stayId]);
    $stay = $stmt->fetch();

    if (!$stay) {
        Response::notFound('Stay record could not be found.');
    }

    if ($stay['stay_status'] === 'Checked Out') {
        Response::error('This guest stay has already been completed and checked out.', [], 400);
    }

    // Role check
    RoleMiddleware::enforcePropertyAccess($authUser, (int)$stay['property_id']);

    $actualCheckout = !empty($input['actual_checkout']) ? $input['actual_checkout'] : date('Y-m-d H:i:s');

    // Update Stay Record
    $updateStay = $db->prepare("
        UPDATE stays
        SET stay_status = 'Checked Out',
            actual_checkout = :actual_checkout
        WHERE id = :id
    ");
    $updateStay->execute([
        ':actual_checkout' => $actualCheckout,
        ':id'              => $stayId
    ]);

    // Free the Room (set status to Available)
    $updateRoom = $db->prepare("UPDATE rooms SET status = 'Available' WHERE id = :room_id");
    $updateRoom->execute([':room_id' => $stay['room_id']]);

    AuditLogger::log('Guest Check-Out', 'Stay', $stay['stay_code'], "Completed check-out for Stay #{$stay['id']} at Property #{$stay['property_id']}", $authUser['id'], $authUser['email'], $authUser['role_slug']);

    Response::success('Guest checked out successfully.', [
        'stay_id'         => $stayId,
        'stay_code'       => $stay['stay_code'],
        'actual_checkout' => $actualCheckout,
        'stay_status'     => 'Checked Out'
    ]);
} catch (Exception $e) {
    Response::error('Check-out failed: ' . $e->getMessage(), [], 500);
}
