<?php
/**
 * ATITHYA360 – PDO Database Connection & Self-Contained Demo Adapter
 * Seamlessly connects to MySQL 8+ (XAMPP/WAMP), with an intelligent in-memory demo mock adapter
 * when running standalone without MySQL daemon started.
 */

require_once __DIR__ . '/config.php';

class MockPDOStatement {
    private array $data;
    private int $cursor = 0;

    public function __construct(array $data = []) {
        $this->data = $data;
    }

    public function execute(?array $params = null): bool {
        $this->cursor = 0;
        return true;
    }

    public function fetchAll(int $mode = PDO::FETCH_ASSOC): array {
        return $this->data;
    }

    public function fetch(int $mode = PDO::FETCH_ASSOC) {
        if ($this->cursor < count($this->data)) {
            return $this->data[$this->cursor++];
        }
        return false;
    }

    public function bindValue($param, $value, $type = PDO::PARAM_STR): bool {
        return true;
    }
}

class MockPDODatabase {
    private array $dbState = [];

    public function __construct() {
        $this->loadSeedData();
    }

    private function loadSeedData(): void {
        $this->dbState['roles'] = [
            ['id' => 1, 'name' => 'Super Admin', 'slug' => 'super_admin', 'description' => 'Full platform control'],
            ['id' => 2, 'name' => 'State Admin', 'slug' => 'state_admin', 'description' => 'State-level oversight'],
            ['id' => 3, 'name' => 'District Tourism Admin', 'slug' => 'district_admin', 'description' => 'District-level tourism metrics'],
            ['id' => 4, 'name' => 'Police Admin', 'slug' => 'police_admin', 'description' => 'Jurisdictional police command'],
            ['id' => 5, 'name' => 'Police Officer', 'slug' => 'police_officer', 'description' => 'Station-level guest search'],
            ['id' => 6, 'name' => 'Tourism Admin', 'slug' => 'tourism_admin', 'description' => 'Tourism analytics and BI'],
            ['id' => 7, 'name' => 'Property Owner', 'slug' => 'property_owner', 'description' => 'Accommodation management'],
            ['id' => 8, 'name' => 'Property Staff', 'slug' => 'property_staff', 'description' => 'Front-desk operations']
        ];

        $this->dbState['states'] = [
            ['id' => 1, 'name' => 'West Bengal', 'state_code' => 'WB', 'country_id' => 1, 'is_active' => 1],
            ['id' => 2, 'name' => 'Odisha', 'state_code' => 'OD', 'country_id' => 1, 'is_active' => 1],
            ['id' => 3, 'name' => 'Rajasthan', 'state_code' => 'RJ', 'country_id' => 1, 'is_active' => 1],
            ['id' => 4, 'name' => 'Himachal Pradesh', 'state_code' => 'HP', 'country_id' => 1, 'is_active' => 1],
            ['id' => 5, 'name' => 'Kerala', 'state_code' => 'KL', 'country_id' => 1, 'is_active' => 1],
            ['id' => 6, 'name' => 'Goa', 'state_code' => 'GA', 'country_id' => 1, 'is_active' => 1],
            ['id' => 7, 'name' => 'Uttarakhand', 'state_code' => 'UK', 'country_id' => 1, 'is_active' => 1],
            ['id' => 8, 'name' => 'Maharashtra', 'state_code' => 'MH', 'country_id' => 1, 'is_active' => 1]
        ];

        $this->dbState['districts'] = [
            ['id' => 1, 'state_id' => 1, 'name' => 'Kolkata', 'district_code' => 'KOL'],
            ['id' => 2, 'state_id' => 1, 'name' => 'Darjeeling', 'district_code' => 'DAR'],
            ['id' => 3, 'state_id' => 2, 'name' => 'Puri', 'district_code' => 'PUR'],
            ['id' => 4, 'state_id' => 3, 'name' => 'Jaipur', 'district_code' => 'JAI'],
            ['id' => 5, 'state_id' => 3, 'name' => 'Udaipur', 'district_code' => 'UDR'],
            ['id' => 6, 'state_id' => 4, 'name' => 'Shimla', 'district_code' => 'SHM'],
            ['id' => 7, 'state_id' => 6, 'name' => 'North Goa', 'district_code' => 'NGOA']
        ];

        $this->dbState['police_stations'] = [
            ['id' => 1, 'district_id' => 1, 'station_name' => 'Park Street Police Station', 'station_code' => 'PS-KOL-01', 'contact_number' => '+91 33 2229 4444'],
            ['id' => 2, 'district_id' => 2, 'station_name' => 'Darjeeling Sadar Police Station', 'station_code' => 'PS-DAR-01', 'contact_number' => '+91 354 225 2100'],
            ['id' => 3, 'district_id' => 3, 'station_name' => 'Sea Beach Police Station', 'station_code' => 'PS-PUR-01', 'contact_number' => '+91 6752 222 050'],
            ['id' => 4, 'district_id' => 4, 'station_name' => 'Kotwali Police Station Jaipur', 'station_code' => 'PS-JAI-01', 'contact_number' => '+91 141 260 1100'],
            ['id' => 5, 'district_id' => 7, 'station_name' => 'Calangute Police Station', 'station_code' => 'PS-NGOA-01', 'contact_number' => '+91 832 227 8234']
        ];

        $this->dbState['destinations'] = [
            ['id' => 1, 'district_id' => 1, 'name' => 'Victoria Memorial & Heritage Hub', 'category' => 'Heritage', 'annual_visitors_estimate' => 1850000, 'is_popular' => 1, 'district_name' => 'Kolkata', 'state_name' => 'West Bengal'],
            ['id' => 2, 'district_id' => 2, 'name' => 'Darjeeling Himalayan Ridge & Tea Trails', 'category' => 'Hill Station', 'annual_visitors_estimate' => 1200000, 'is_popular' => 1, 'district_name' => 'Darjeeling', 'state_name' => 'West Bengal'],
            ['id' => 3, 'district_id' => 3, 'name' => 'Puri Golden Beach & Temple Precinct', 'category' => 'Pilgrimage', 'annual_visitors_estimate' => 2900000, 'is_popular' => 1, 'district_name' => 'Puri', 'state_name' => 'Odisha'],
            ['id' => 4, 'district_id' => 4, 'name' => 'Amber Fort & Royal City Complex', 'category' => 'Heritage', 'annual_visitors_estimate' => 2400000, 'is_popular' => 1, 'district_name' => 'Jaipur', 'state_name' => 'Rajasthan'],
            ['id' => 5, 'district_id' => 7, 'name' => 'Calangute & Baga Coastal Promenade', 'category' => 'Beach', 'annual_visitors_estimate' => 3500000, 'is_popular' => 1, 'district_name' => 'North Goa', 'state_name' => 'Goa']
        ];

        $this->dbState['countries'] = [
            ['id' => 1, 'iso_code' => 'IND', 'name' => 'India', 'phone_code' => '+91', 'is_active' => 1],
            ['id' => 2, 'iso_code' => 'BGD', 'name' => 'Bangladesh', 'phone_code' => '+880', 'is_active' => 1],
            ['id' => 3, 'iso_code' => 'USA', 'name' => 'United States', 'phone_code' => '+1', 'is_active' => 1],
            ['id' => 4, 'iso_code' => 'GBR', 'name' => 'United Kingdom', 'phone_code' => '+44', 'is_active' => 1],
            ['id' => 5, 'iso_code' => 'DEU', 'name' => 'Germany', 'phone_code' => '+49', 'is_active' => 1],
            ['id' => 6, 'iso_code' => 'FRA', 'name' => 'France', 'phone_code' => '+33', 'is_active' => 1],
            ['id' => 7, 'iso_code' => 'AUS', 'name' => 'Australia', 'phone_code' => '+61', 'is_active' => 1]
        ];

        $this->dbState['users'] = [
            ['id' => 1, 'role_id' => 1, 'full_name' => 'Vikram Malhotra (Super Admin)', 'email' => 'admin@atithya360.demo', 'password_hash' => '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', 'mobile' => '+91 9811001100', 'designation' => 'Director General of Systems', 'role_name' => 'Super Admin', 'role_slug' => 'super_admin', 'status' => 'Active', 'property_id' => null, 'state_id' => 1, 'district_id' => 1, 'police_station_id' => 1],
            ['id' => 2, 'role_id' => 7, 'full_name' => 'Rajesh Sen (Grand Heritage)', 'email' => 'hotel@atithya360.demo', 'password_hash' => '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', 'mobile' => '+91 9830012345', 'designation' => 'Managing Proprietor', 'role_name' => 'Property Owner', 'role_slug' => 'property_owner', 'status' => 'Active', 'property_id' => 1, 'property_name' => 'The Grand Heritage Park Hotel', 'property_code' => 'PROP-KOL-1001', 'state_id' => 1, 'district_id' => 1, 'police_station_id' => 1],
            ['id' => 3, 'role_id' => 5, 'full_name' => 'Inspector Ananya Roy', 'email' => 'police@atithya360.demo', 'password_hash' => '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', 'mobile' => '+91 9840056789', 'designation' => 'Station Officer (In-Charge)', 'role_name' => 'Police Officer', 'role_slug' => 'police_officer', 'status' => 'Active', 'property_id' => null, 'state_id' => 1, 'district_id' => 1, 'police_station_id' => 1, 'station_name' => 'Park Street Police Station'],
            ['id' => 4, 'role_id' => 6, 'full_name' => 'Dr. Arindam Bose', 'email' => 'tourism@atithya360.demo', 'password_hash' => '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', 'mobile' => '+91 9850067890', 'designation' => 'Chief Tourism Intelligence Officer', 'role_name' => 'Tourism Admin', 'role_slug' => 'tourism_admin', 'status' => 'Active', 'property_id' => null, 'state_id' => 1, 'district_id' => 1, 'police_station_id' => null]
        ];

        $this->dbState['properties'] = [
            ['id' => 1, 'property_code' => 'PROP-KOL-1001', 'name' => 'The Grand Heritage Park Hotel', 'property_type' => 'Hotel', 'owner_name' => 'Rajesh Sen', 'contact_number' => '+91 33 4001 8800', 'email' => 'contact@grandheritagekol.demo', 'city' => 'Kolkata', 'address' => '18/A Park Street', 'district_id' => 1, 'state_id' => 1, 'pincode' => '700016', 'police_station_id' => 1, 'station_name' => 'Park Street Police Station', 'state_name' => 'West Bengal', 'district_name' => 'Kolkata', 'room_capacity' => 45, 'status' => 'Active', 'total_rooms' => 8, 'active_guests' => 3],
            ['id' => 2, 'property_code' => 'PROP-KOL-1002', 'name' => 'Salt Lake Eco Boutique Homestay', 'property_type' => 'Homestay', 'owner_name' => 'Sunita Guha', 'contact_number' => '+91 33 2358 1200', 'email' => 'stay@saltlakehomestay.demo', 'city' => 'Kolkata', 'address' => 'Sector 3, Salt Lake', 'district_id' => 1, 'state_id' => 1, 'pincode' => '700098', 'police_station_id' => 1, 'station_name' => 'Park Street Police Station', 'state_name' => 'West Bengal', 'district_name' => 'Kolkata', 'room_capacity' => 8, 'status' => 'Active', 'total_rooms' => 2, 'active_guests' => 1],
            ['id' => 3, 'property_code' => 'PROP-DAR-2001', 'name' => 'Pine Valley Himalayan Retreat', 'property_type' => 'Resort', 'owner_name' => 'Pemba Sherpa', 'contact_number' => '+91 354 225 6700', 'email' => 'stay@pinevalleyresort.demo', 'city' => 'Darjeeling', 'address' => 'Mall Road Above Chowrasta', 'district_id' => 2, 'state_id' => 1, 'pincode' => '734101', 'police_station_id' => 2, 'station_name' => 'Darjeeling Sadar Police Station', 'state_name' => 'West Bengal', 'district_name' => 'Darjeeling', 'room_capacity' => 28, 'status' => 'Active', 'total_rooms' => 3, 'active_guests' => 2],
            ['id' => 5, 'property_code' => 'PROP-PUR-3001', 'name' => 'Sea Breeze Grand Golden Beach', 'property_type' => 'Hotel', 'owner_name' => 'Manoj Tripathy', 'contact_number' => '+91 6752 230 400', 'email' => 'info@puriseabreeze.demo', 'city' => 'Puri', 'address' => 'Chakratirtha Marine Drive', 'district_id' => 3, 'state_id' => 2, 'pincode' => '752002', 'police_station_id' => 3, 'station_name' => 'Sea Beach Police Station', 'state_name' => 'Odisha', 'district_name' => 'Puri', 'room_capacity' => 55, 'status' => 'Active', 'total_rooms' => 3, 'active_guests' => 1],
            ['id' => 7, 'property_code' => 'PROP-JAI-4001', 'name' => 'Royal Rajputana Heritage Haveli', 'property_type' => 'Hotel', 'owner_name' => 'Bhairon Singh', 'contact_number' => '+91 141 262 4400', 'email' => 'heritage@rajputanahaveli.demo', 'city' => 'Jaipur', 'address' => 'Amber Road, Old City', 'district_id' => 4, 'state_id' => 3, 'pincode' => '302002', 'police_station_id' => 4, 'station_name' => 'Kotwali Police Station Jaipur', 'state_name' => 'Rajasthan', 'district_name' => 'Jaipur', 'room_capacity' => 35, 'status' => 'Active', 'total_rooms' => 2, 'active_guests' => 1]
        ];

        $this->dbState['rooms'] = [
            ['id' => 1, 'property_id' => 1, 'room_number' => '101', 'room_type' => 'Deluxe', 'max_occupancy' => 2, 'status' => 'Occupied'],
            ['id' => 2, 'property_id' => 1, 'room_number' => '102', 'room_type' => 'Deluxe', 'max_occupancy' => 2, 'status' => 'Occupied'],
            ['id' => 3, 'property_id' => 1, 'room_number' => '103', 'room_type' => 'Standard', 'max_occupancy' => 2, 'status' => 'Available'],
            ['id' => 4, 'property_id' => 1, 'room_number' => '104', 'room_type' => 'Standard', 'max_occupancy' => 2, 'status' => 'Available'],
            ['id' => 5, 'property_id' => 1, 'room_number' => '201', 'room_type' => 'Suite', 'max_occupancy' => 4, 'status' => 'Occupied'],
            ['id' => 6, 'property_id' => 1, 'room_number' => '202', 'room_type' => 'Suite', 'max_occupancy' => 4, 'status' => 'Available'],
            ['id' => 7, 'property_id' => 1, 'room_number' => '203', 'room_type' => 'Deluxe', 'max_occupancy' => 2, 'status' => 'Occupied'],
            ['id' => 8, 'property_id' => 1, 'room_number' => '301', 'room_type' => 'Standard', 'max_occupancy' => 2, 'status' => 'Maintenance']
        ];

        $this->dbState['guests'] = [
            ['id' => 1, 'guest_code' => 'GST-IND-1001', 'guest_type' => 'Indian Guest', 'full_name' => 'Amitabh Sengupta', 'gender' => 'Male', 'mobile' => '+91 9831122334', 'email' => 'amitabh.sen@example.com', 'nationality' => 'Indian', 'address' => '45 Southern Avenue', 'city' => 'Kolkata', 'country_name' => 'India', 'state_name' => 'West Bengal', 'purpose_of_visit' => 'Tourism'],
            ['id' => 2, 'guest_code' => 'GST-IND-1002', 'guest_type' => 'Indian Guest', 'full_name' => 'Priyanka Banerjee', 'gender' => 'Female', 'mobile' => '+91 9830998877', 'email' => 'priyanka.b@example.com', 'nationality' => 'Indian', 'address' => '12 Salt Lake Sector 2', 'city' => 'Kolkata', 'country_name' => 'India', 'state_name' => 'West Bengal', 'purpose_of_visit' => 'Business'],
            ['id' => 16, 'guest_code' => 'GST-FOR-2001', 'guest_type' => 'Foreign Visitor', 'full_name' => 'John Alexander Smith', 'gender' => 'Male', 'mobile' => '+1 415 555 2671', 'email' => 'john.smith@example.org', 'nationality' => 'American', 'address' => '742 Evergreen Terrace', 'city' => 'San Francisco', 'country_name' => 'United States', 'passport_number' => 'PASS-USA-998811', 'visa_number' => 'VISA-IND-T-88192', 'visa_type' => 'e-Tourist (30 Days)', 'purpose_of_visit' => 'Tourism', 'foreign_verification_status' => 'Verified'],
            ['id' => 17, 'guest_code' => 'GST-FOR-2002', 'guest_type' => 'Foreign Visitor', 'full_name' => 'Emily Charlotte Watson', 'gender' => 'Female', 'mobile' => '+44 20 7946 0912', 'email' => 'emily.watson@example.co.uk', 'nationality' => 'British', 'address' => '14 Kensington St', 'city' => 'London', 'country_name' => 'United Kingdom', 'passport_number' => 'PASS-GBR-772233', 'visa_number' => 'VISA-IND-T-77201', 'visa_type' => 'e-Tourist (1 Year)', 'purpose_of_visit' => 'Tourism', 'foreign_verification_status' => 'Verified']
        ];

        $this->dbState['stays'] = [
            ['id' => 1, 'stay_id' => 1, 'stay_code' => 'STY-2026-1001', 'guest_id' => 1, 'property_id' => 1, 'room_id' => 1, 'room_number' => '101', 'room_type' => 'Deluxe', 'guest_name' => 'Amitabh Sengupta', 'full_name' => 'Amitabh Sengupta', 'guest_type' => 'Indian Guest', 'nationality' => 'Indian', 'guest_mobile' => '+91 9831122334', 'mobile' => '+91 9831122334', 'property_name' => 'The Grand Heritage Park Hotel', 'property_code' => 'PROP-KOL-1001', 'property_city' => 'Kolkata', 'state_name' => 'West Bengal', 'district_name' => 'Kolkata', 'station_name' => 'Park Street Police Station', 'checkin_time' => '2026-09-20 12:00:00', 'expected_checkout' => '2026-09-24 11:00:00', 'stay_status' => 'Checked In'],
            ['id' => 2, 'stay_id' => 2, 'stay_code' => 'STY-2026-1002', 'guest_id' => 2, 'property_id' => 1, 'room_id' => 2, 'room_number' => '102', 'room_type' => 'Deluxe', 'guest_name' => 'Priyanka Banerjee', 'full_name' => 'Priyanka Banerjee', 'guest_type' => 'Indian Guest', 'nationality' => 'Indian', 'guest_mobile' => '+91 9830998877', 'mobile' => '+91 9830998877', 'property_name' => 'The Grand Heritage Park Hotel', 'property_code' => 'PROP-KOL-1001', 'property_city' => 'Kolkata', 'state_name' => 'West Bengal', 'district_name' => 'Kolkata', 'station_name' => 'Park Street Police Station', 'checkin_time' => '2026-09-21 14:30:00', 'expected_checkout' => '2026-09-23 11:00:00', 'stay_status' => 'Checked In'],
            ['id' => 3, 'stay_id' => 3, 'stay_code' => 'STY-2026-1003', 'guest_id' => 16, 'property_id' => 1, 'room_id' => 5, 'room_number' => '201', 'room_type' => 'Suite', 'guest_name' => 'John Alexander Smith', 'full_name' => 'John Alexander Smith', 'guest_type' => 'Foreign Visitor', 'nationality' => 'American', 'guest_mobile' => '+1 415 555 2671', 'mobile' => '+1 415 555 2671', 'passport_number' => 'PASS-USA-998811', 'visa_number' => 'VISA-IND-T-88192', 'property_name' => 'The Grand Heritage Park Hotel', 'property_code' => 'PROP-KOL-1001', 'property_city' => 'Kolkata', 'state_name' => 'West Bengal', 'district_name' => 'Kolkata', 'station_name' => 'Park Street Police Station', 'checkin_time' => '2026-09-19 16:00:00', 'expected_checkout' => '2026-09-25 10:00:00', 'stay_status' => 'Checked In'],
            ['id' => 4, 'stay_id' => 4, 'stay_code' => 'STY-2026-1004', 'guest_id' => 17, 'property_id' => 3, 'room_id' => 3, 'room_number' => 'Cottage-1', 'room_type' => 'Cottage', 'guest_name' => 'Emily Charlotte Watson', 'full_name' => 'Emily Charlotte Watson', 'guest_type' => 'Foreign Visitor', 'nationality' => 'British', 'guest_mobile' => '+44 20 7946 0912', 'mobile' => '+44 20 7946 0912', 'passport_number' => 'PASS-GBR-772233', 'visa_number' => 'VISA-IND-T-77201', 'property_name' => 'Pine Valley Himalayan Retreat', 'property_code' => 'PROP-DAR-2001', 'property_city' => 'Darjeeling', 'state_name' => 'West Bengal', 'district_name' => 'Darjeeling', 'station_name' => 'Darjeeling Sadar Police Station', 'checkin_time' => '2026-09-18 15:00:00', 'expected_checkout' => '2026-09-23 11:00:00', 'stay_status' => 'Checked In']
        ];

        $this->dbState['alerts'] = [
            ['id' => 1, 'alert_code' => 'ALT-2026-01', 'alert_type' => 'Document Verification Pending', 'severity' => 'Medium', 'title' => 'Foreign Visitor Document Review Flagged', 'message' => 'Document reference PASS-ITA-551122 metadata requires standard review for clearance confirmation.', 'status' => 'Open', 'assigned_officer' => 'Inspector Ananya Roy', 'officer_designation' => 'Station Officer', 'created_at' => '2026-09-22 10:15:00'],
            ['id' => 2, 'alert_code' => 'ALT-2026-02', 'alert_type' => 'Property Verification Pending', 'severity' => 'Low', 'title' => 'New Accommodation Registration Pending Inspection', 'message' => 'Hooghly View Heritage Lodge has completed registration and awaits District Police Station site verification.', 'status' => 'Open', 'assigned_officer' => 'Inspector Ananya Roy', 'officer_designation' => 'Station Officer', 'created_at' => '2026-09-22 09:30:00']
        ];

        $this->dbState['audit_logs'] = [
            ['id' => 1, 'user_email' => 'admin@atithya360.demo', 'user_role' => 'Super Admin', 'action' => 'System Initialization', 'entity' => 'System', 'entity_id' => 'SYS', 'ip_address' => '127.0.0.1', 'details' => 'Platform initialized with synthetic master dataset.', 'created_at' => '2026-09-22 14:30:00'],
            ['id' => 2, 'user_email' => 'hotel@atithya360.demo', 'user_role' => 'Property Owner', 'action' => 'Guest Check-In', 'entity' => 'Stay', 'entity_id' => 'STY-2026-1001', 'ip_address' => '192.168.1.45', 'details' => 'Checked in Indian citizen Amitabh Sengupta in Room 101.', 'created_at' => '2026-09-22 14:45:00'],
            ['id' => 3, 'user_email' => 'police@atithya360.demo', 'user_role' => 'Police Officer', 'action' => 'Police Guest Search', 'entity' => 'Guest', 'entity_id' => 'SEARCH-Q', 'ip_address' => '10.0.4.12', 'details' => 'Authorized search executed for active foreign tourist check-ins.', 'created_at' => '2026-09-22 15:10:00']
        ];

        $this->dbState['system_settings'] = [
            ['setting_key' => 'platform_name', 'setting_value' => 'ATITHYA360', 'category' => 'General', 'description' => 'Platform Name'],
            ['setting_key' => 'platform_tagline', 'setting_value' => 'Smarter Stays. Safer Destinations.', 'category' => 'General', 'description' => 'Official System Tagline'],
            ['setting_key' => 'demo_mode', 'setting_value' => '1', 'category' => 'System', 'description' => 'Enables demonstration mode with synthetic records'],
            ['setting_key' => 'require_document_upload', 'setting_value' => '1', 'category' => 'Security', 'description' => 'Require document metadata prior to check-in']
        ];
    }

    public function query(string $sql): MockPDOStatement {
        return $this->prepare($sql);
    }

    public function prepare(string $sql): MockPDOStatement {
        $sqlLower = strtolower($sql);

        if (strpos($sqlLower, 'from states') !== false) {
            return new MockPDOStatement($this->dbState['states']);
        }
        if (strpos($sqlLower, 'from districts') !== false) {
            return new MockPDOStatement($this->dbState['districts']);
        }
        if (strpos($sqlLower, 'from police_stations') !== false) {
            return new MockPDOStatement($this->dbState['police_stations']);
        }
        if (strpos($sqlLower, 'from destinations') !== false) {
            return new MockPDOStatement($this->dbState['destinations']);
        }
        if (strpos($sqlLower, 'from countries') !== false) {
            return new MockPDOStatement($this->dbState['countries']);
        }
        if (strpos($sqlLower, 'from roles') !== false) {
            return new MockPDOStatement($this->dbState['roles']);
        }
        if (strpos($sqlLower, 'from users') !== false) {
            return new MockPDOStatement($this->dbState['users']);
        }
        if (strpos($sqlLower, 'from properties') !== false) {
            if (strpos($sqlLower, 'count(*)') !== false) {
                return new MockPDOStatement([['total' => count($this->dbState['properties']), 'active' => count($this->dbState['properties'])]]);
            }
            return new MockPDOStatement($this->dbState['properties']);
        }
        if (strpos($sqlLower, 'from rooms') !== false) {
            if (strpos($sqlLower, 'count(*)') !== false) {
                return new MockPDOStatement([['total_rooms' => count($this->dbState['rooms']), 'occupied_rooms' => 4, 'available_rooms' => 3]]);
            }
            return new MockPDOStatement($this->dbState['rooms']);
        }
        if (strpos($sqlLower, 'from guests') !== false) {
            if (strpos($sqlLower, 'count(*)') !== false) {
                return new MockPDOStatement([['total_guests' => 100, 'indian_guests' => 80, 'foreign_visitors' => 20, 'total' => 100]]);
            }
            return new MockPDOStatement($this->dbState['guests']);
        }
        if (strpos($sqlLower, 'from stays') !== false) {
            if (strpos($sqlLower, 'count(*)') !== false) {
                return new MockPDOStatement([['total' => 50, 'total_stays' => 50, 'active_stays' => 14, 'completed_stays' => 36, 'today_checkins' => 8, 'today_checkouts' => 5]]);
            }
            return new MockPDOStatement($this->dbState['stays']);
        }
        if (strpos($sqlLower, 'from alerts') !== false) {
            if (strpos($sqlLower, 'count(*)') !== false) {
                return new MockPDOStatement([['total_alerts' => count($this->dbState['alerts']), 'open_alerts' => 2, 'review_alerts' => 1, 'high_severity_alerts' => 1]]);
            }
            return new MockPDOStatement($this->dbState['alerts']);
        }
        if (strpos($sqlLower, 'from audit_logs') !== false) {
            if (strpos($sqlLower, 'count(*)') !== false) {
                return new MockPDOStatement([['total' => count($this->dbState['audit_logs'])]]);
            }
            return new MockPDOStatement($this->dbState['audit_logs']);
        }
        if (strpos($sqlLower, 'from system_settings') !== false) {
            return new MockPDOStatement($this->dbState['system_settings']);
        }

        return new MockPDOStatement([]);
    }

    public function lastInsertId(): string {
        return (string)rand(100, 999);
    }
}

class Database {
    private static $instance = null;
    private static string $driver = 'mysql';

    public static function getConnection() {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // 1. Try MySQL Connection First (Standard XAMPP / WAMP / Production)
        if (class_exists('PDO') && extension_loaded('pdo_mysql')) {
            try {
                $dsn = sprintf(
                    'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                    DB_HOST,
                    DB_PORT,
                    DB_NAME
                );

                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false
                ];

                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                self::$driver = 'mysql';
                return self::$instance;
            } catch (Throwable $e) {
                // MySQL service unreachable, proceed to fallback
            }
        }

        // 2. Graceful In-Memory Demo Adapter Fallback (Zero crash when MySQL is not running)
        self::$instance = new MockPDODatabase();
        self::$driver = 'mock_demo';
        return self::$instance;
    }

    public static function getDriver(): string {
        return self::$driver;
    }
}
