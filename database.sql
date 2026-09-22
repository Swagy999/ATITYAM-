-- =============================================================================
-- ATITHYA360 – Digital Guest Registration & Tourism Intelligence Platform
-- Root Database Schema and Synthetic Sample Dataset (Demo / Prototype Platform)
-- MySQL 8.0+ Compatible / XAMPP & WAMP Ready
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `atithya360` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `atithya360`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `module` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `countries`;
CREATE TABLE `countries` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `iso_code` VARCHAR(3) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `phone_code` VARCHAR(10) NULL,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `states`;
CREATE TABLE `states` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `state_code` VARCHAR(10) NOT NULL UNIQUE,
  `country_id` INT UNSIGNED DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1,
  CONSTRAINT `fk_state_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `districts`;
CREATE TABLE `districts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `state_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `district_code` VARCHAR(10) NULL,
  CONSTRAINT `fk_district_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `police_stations`;
CREATE TABLE `police_stations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `district_id` INT UNSIGNED NOT NULL,
  `station_name` VARCHAR(150) NOT NULL,
  `station_code` VARCHAR(50) NOT NULL UNIQUE,
  `contact_number` VARCHAR(20) NULL,
  `email` VARCHAR(100) NULL,
  `address` TEXT NULL,
  CONSTRAINT `fk_ps_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `destinations`;
CREATE TABLE `destinations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `district_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('Heritage', 'Nature', 'Pilgrimage', 'Beach', 'Hill Station', 'Wildlife', 'Urban') DEFAULT 'Nature',
  `description` TEXT NULL,
  `latitude` DECIMAL(10, 7) NULL,
  `longitude` DECIMAL(10, 7) NULL,
  `annual_visitors_estimate` INT UNSIGNED DEFAULT 0,
  `is_popular` TINYINT(1) DEFAULT 1,
  CONSTRAINT `fk_dest_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT UNSIGNED NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(20) NULL,
  `designation` VARCHAR(100) NULL,
  `state_id` INT UNSIGNED NULL,
  `district_id` INT UNSIGNED NULL,
  `police_station_id` INT UNSIGNED NULL,
  `property_id` INT UNSIGNED NULL,
  `status` ENUM('Active', 'Inactive', 'Suspended', 'Pending') DEFAULT 'Active',
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role_id`),
  INDEX `idx_users_email` (`email`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_users_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_users_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_users_ps` FOREIGN KEY (`police_station_id`) REFERENCES `police_stations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `property_code` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `property_type` ENUM('Hotel', 'Homestay', 'Guest House', 'Lodge', 'Resort', 'Other') DEFAULT 'Hotel',
  `owner_id` INT UNSIGNED NULL,
  `owner_name` VARCHAR(100) NOT NULL,
  `contact_number` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `district_id` INT UNSIGNED NOT NULL,
  `state_id` INT UNSIGNED NOT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `police_station_id` INT UNSIGNED NOT NULL,
  `license_number` VARCHAR(50) NOT NULL,
  `registration_number` VARCHAR(50) NOT NULL,
  `room_capacity` INT UNSIGNED NOT NULL DEFAULT 1,
  `contact_person` VARCHAR(100) NULL,
  `status` ENUM('Pending', 'Verified', 'Rejected', 'Suspended', 'Active') DEFAULT 'Verified',
  `verification_notes` TEXT NULL,
  `verified_by` INT UNSIGNED NULL,
  `verified_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_property_district` (`district_id`),
  INDEX `idx_property_status` (`status`),
  INDEX `idx_property_code` (`property_code`),
  CONSTRAINT `fk_prop_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_prop_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_prop_ps` FOREIGN KEY (`police_station_id`) REFERENCES `police_stations` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT UNSIGNED NOT NULL,
  `room_number` VARCHAR(20) NOT NULL,
  `room_type` ENUM('Standard', 'Deluxe', 'Suite', 'Dormitory', 'Villa', 'Cottage') DEFAULT 'Standard',
  `max_occupancy` INT UNSIGNED DEFAULT 2,
  `status` ENUM('Available', 'Occupied', 'Maintenance', 'Reserved') DEFAULT 'Available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_prop_room` (`property_id`, `room_number`),
  CONSTRAINT `fk_room_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `property_documents`;
CREATE TABLE `property_documents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT UNSIGNED NOT NULL,
  `document_type` ENUM('Trade License', 'Fire NOC', 'Tourism Registration', 'FSSAI License', 'Ownership Proof', 'Other') NOT NULL,
  `document_reference` VARCHAR(100) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `verification_status` ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Verified',
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pdoc_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `guests`;
CREATE TABLE `guests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `guest_code` VARCHAR(30) NOT NULL UNIQUE,
  `guest_type` ENUM('Indian Guest', 'Foreign Visitor') NOT NULL DEFAULT 'Indian Guest',
  `full_name` VARCHAR(150) NOT NULL,
  `dob` DATE NULL,
  `gender` ENUM('Male', 'Female', 'Other', 'Prefer not to say') DEFAULT 'Male',
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) NULL,
  `nationality` VARCHAR(100) NOT NULL DEFAULT 'Indian',
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state_id` INT UNSIGNED NULL,
  `country_id` INT UNSIGNED DEFAULT 1,
  `emergency_contact` VARCHAR(50) NULL,
  `purpose_of_visit` ENUM('Tourism', 'Business', 'Medical', 'Education', 'Family Visit', 'Transit', 'Other') DEFAULT 'Tourism',
  `passport_number` VARCHAR(50) NULL,
  `visa_number` VARCHAR(50) NULL,
  `visa_type` VARCHAR(50) NULL,
  `visa_expiry` DATE NULL,
  `port_of_entry` VARCHAR(100) NULL,
  `foreign_verification_status` ENUM('Not Applicable', 'Pending', 'Verified', 'Rejected', 'Needs Review') DEFAULT 'Not Applicable',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_guests_type` (`guest_type`),
  INDEX `idx_guests_mobile` (`mobile`),
  INDEX `idx_guests_code` (`guest_code`),
  INDEX `idx_guests_country` (`country_id`),
  CONSTRAINT `fk_guest_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_guest_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `guest_documents`;
CREATE TABLE `guest_documents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `guest_id` INT UNSIGNED NOT NULL,
  `document_type` ENUM('Passport', 'Visa', 'Driving License', 'Voter ID', 'National ID Card', 'Other Permitted ID') NOT NULL,
  `document_reference` VARCHAR(100) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `verification_status` ENUM('Pending', 'Verified', 'Rejected', 'Needs Review') DEFAULT 'Verified',
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `verified_at` DATETIME NULL,
  `verified_by` INT UNSIGNED NULL,
  CONSTRAINT `fk_gdoc_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `stays`;
CREATE TABLE `stays` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `stay_code` VARCHAR(30) NOT NULL UNIQUE,
  `guest_id` INT UNSIGNED NOT NULL,
  `property_id` INT UNSIGNED NOT NULL,
  `room_id` INT UNSIGNED NOT NULL,
  `num_guests` INT UNSIGNED DEFAULT 1,
  `checkin_time` DATETIME NOT NULL,
  `expected_checkout` DATETIME NOT NULL,
  `actual_checkout` DATETIME NULL,
  `stay_status` ENUM('Reserved', 'Checked In', 'Checked Out', 'Cancelled') DEFAULT 'Checked In',
  `primary_destination_id` INT UNSIGNED NULL,
  `remarks` TEXT NULL,
  `created_by` INT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_stays_property` (`property_id`),
  INDEX `idx_stays_guest` (`guest_id`),
  INDEX `idx_stays_status` (`stay_status`),
  INDEX `idx_stays_checkin` (`checkin_time`),
  CONSTRAINT `fk_stay_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_stay_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_stay_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_stay_dest` FOREIGN KEY (`primary_destination_id`) REFERENCES `destinations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `alerts`;
CREATE TABLE `alerts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `alert_code` VARCHAR(30) NOT NULL UNIQUE,
  `alert_type` ENUM('Document Verification Pending', 'Property Verification Pending', 'Duplicate Guest Record', 'Unusual Data Pattern', 'Expired Document Metadata', 'Emergency Report') NOT NULL,
  `severity` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Open', 'Under Review', 'Resolved', 'Closed') DEFAULT 'Open',
  `assigned_to` INT UNSIGNED NULL,
  `resolved_notes` TEXT NULL,
  `resolved_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_alert_status` (`status`),
  INDEX `idx_alert_severity` (`severity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `user_email` VARCHAR(150) NULL,
  `user_role` VARCHAR(50) NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(50) NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `details` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_action` (`action`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'General',
  `description` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ROLES
INSERT INTO `roles` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Super Admin', 'super_admin', 'Full platform control, governance, user management, and system configuration'),
(2, 'State Admin', 'state_admin', 'State-level oversight, analytics, property verification, and regional reporting'),
(3, 'District Tourism Admin', 'district_admin', 'District-level tourism metrics, inspections, and property coordination'),
(4, 'Police Admin', 'police_admin', 'Jurisdictional police command, high-priority safety alerts, and authorized investigations'),
(5, 'Police Officer', 'police_officer', 'Station-level guest search, property registry verification, and alert reviews'),
(6, 'Tourism Admin', 'tourism_admin', 'Tourism analytics, destination intelligence, capacity tracking, and visitor trends'),
(7, 'Property Owner', 'property_owner', 'Accommodation management, staff access, check-ins, guest document metadata, and reporting'),
(8, 'Property Staff', 'property_staff', 'Front-desk operations, digital guest check-in, check-out, and room status updates');

-- COUNTRIES
INSERT INTO `countries` (`id`, `iso_code`, `name`, `phone_code`, `is_active`) VALUES
(1, 'IND', 'India', '+91', 1),
(2, 'BGD', 'Bangladesh', '+880', 1),
(3, 'USA', 'United States', '+1', 1),
(4, 'GBR', 'United Kingdom', '+44', 1),
(5, 'DEU', 'Germany', '+49', 1),
(6, 'FRA', 'France', '+33', 1),
(7, 'AUS', 'Australia', '+61', 1),
(8, 'CAN', 'Canada', '+1', 1),
(9, 'JPN', 'Japan', '+81', 1),
(10, 'NPL', 'Nepal', '+977', 1),
(11, 'SGP', 'Singapore', '+65', 1),
(12, 'ARE', 'United Arab Emirates', '+971', 1),
(13, 'MYS', 'Malaysia', '+60', 1),
(14, 'ITA', 'Italy', '+39', 1),
(15, 'ESP', 'Spain', '+34', 1);

-- STATES
INSERT INTO `states` (`id`, `name`, `state_code`, `country_id`, `is_active`) VALUES
(1, 'West Bengal', 'WB', 1, 1),
(2, 'Odisha', 'OD', 1, 1),
(3, 'Rajasthan', 'RJ', 1, 1),
(4, 'Himachal Pradesh', 'HP', 1, 1),
(5, 'Kerala', 'KL', 1, 1),
(6, 'Goa', 'GA', 1, 1),
(7, 'Uttarakhand', 'UK', 1, 1),
(8, 'Maharashtra', 'MH', 1, 1),
(9, 'Tamil Nadu', 'TN', 1, 1),
(10, 'Karnataka', 'KA', 1, 1),
(11, 'Assam', 'AS', 1, 1),
(12, 'Delhi', 'DL', 1, 1),
(13, 'Bihar', 'BR', 1, 1),
(14, 'Jharkhand', 'JH', 1, 1),
(15, 'Madhya Pradesh', 'MP', 1, 1);

-- DISTRICTS
INSERT INTO `districts` (`id`, `state_id`, `name`, `district_code`) VALUES
(1, 1, 'Kolkata', 'KOL'),
(2, 1, 'Darjeeling', 'DAR'),
(3, 1, 'South 24 Parganas', 'S24P'),
(4, 2, 'Puri', 'PUR'),
(5, 2, 'Khordha (Bhubaneswar)', 'BBS'),
(6, 3, 'Jaipur', 'JAI'),
(7, 3, 'Udaipur', 'UDR'),
(8, 4, 'Shimla', 'SHM'),
(9, 4, 'Kullu (Manali)', 'KLU'),
(10, 5, 'Ernakulam (Kochi)', 'KOC'),
(11, 5, 'Idukki (Munnar)', 'IDK'),
(12, 6, 'North Goa', 'NGOA'),
(13, 6, 'South Goa', 'SGOA'),
(14, 7, 'Dehradun (Rishikesh)', 'DDN'),
(15, 8, 'Mumbai City', 'MUM'),
(16, 10, 'Mysuru', 'MYS'),
(17, 12, 'New Delhi', 'NDL');

-- POLICE STATIONS
INSERT INTO `police_stations` (`id`, `district_id`, `station_name`, `station_code`, `contact_number`, `email`, `address`) VALUES
(1, 1, 'Park Street Police Station', 'PS-KOL-01', '+91 33 2229 4444', 'ps.parkst@police.demo', 'Park Street, Kolkata, WB'),
(2, 2, 'Darjeeling Sadar Police Station', 'PS-DAR-01', '+91 354 225 2100', 'ps.darjeeling@police.demo', 'Mall Road, Darjeeling, WB'),
(3, 4, 'Sea Beach Police Station', 'PS-PUR-01', '+91 6752 222 050', 'ps.seabeach@police.demo', 'Chakratirtha Road, Puri, OD'),
(4, 6, 'Kotwali Police Station Jaipur', 'PS-JAI-01', '+91 141 260 1100', 'ps.kotwali.jpr@police.demo', 'Johari Bazaar, Jaipur, RJ'),
(5, 7, 'Ghantaghar Police Station Udaipur', 'PS-UDR-01', '+91 294 241 3300', 'ps.ghantaghar@police.demo', 'Old City, Udaipur, RJ'),
(6, 8, 'Mall Road Police Station Shimla', 'PS-SHM-01', '+91 177 265 2123', 'ps.shimlamall@police.demo', 'The Ridge, Shimla, HP'),
(7, 9, 'Manali Town Police Station', 'PS-KLU-01', '+91 1902 252 320', 'ps.manali@police.demo', 'Model Town, Manali, HP'),
(8, 10, 'Fort Kochi Police Station', 'PS-KOC-01', '+91 484 221 5055', 'ps.fortkochi@police.demo', 'KB Jacob Rd, Fort Kochi, KL'),
(9, 12, 'Calangute Police Station', 'PS-NGOA-01', '+91 832 227 8234', 'ps.calangute@police.demo', 'Calangute Beach Rd, North Goa, GA'),
(10, 14, 'Rishikesh Town Police Station', 'PS-DDN-01', '+91 135 243 0014', 'ps.rishikesh@police.demo', 'Laxman Jhula Rd, Rishikesh, UK');

-- DESTINATIONS
INSERT INTO `destinations` (`id`, `district_id`, `name`, `category`, `description`, `annual_visitors_estimate`, `is_popular`) VALUES
(1, 1, 'Victoria Memorial & Heritage Hub', 'Heritage', 'Iconic marble monument and cultural heritage zone in central Kolkata', 1850000, 1),
(2, 2, 'Darjeeling Himalayan Ridge & Tea Trails', 'Hill Station', 'Scenic sunrise points, world-famous tea gardens and Himalayan toy train', 1200000, 1),
(3, 4, 'Puri Golden Beach & Temple Precinct', 'Pilgrimage', 'Spiritual center and pristine coastal destination along Bay of Bengal', 2900000, 1),
(4, 6, 'Amber Fort & Royal City Complex', 'Heritage', 'Historic hill fortress and architectural landmark in Jaipur', 2400000, 1),
(5, 7, 'Lake Pichola & City Palace Lakeview', 'Heritage', 'Majestic palace complex overlooking pristine natural lakes', 1450000, 1),
(6, 8, 'Shimla Ridge & Kalka Railway Route', 'Hill Station', 'Colonial heritage hill resort surrounded by pine forests', 1650000, 1),
(7, 9, 'Solang Valley & Rohtang Pass Manali', 'Nature', 'Alpine adventure hub, river rafting, and snow points', 2100000, 1),
(8, 10, 'Fort Kochi Colonial Waterfront', 'Heritage', 'Historic spice trading port with Portuguese architecture and Chinese nets', 1350000, 1),
(9, 11, 'Munnar Tea Highlands & Anamudi Peak', 'Nature', 'Rolling emerald hills, mist-covered valleys and tea plantations', 1780000, 1),
(10, 12, 'Calangute & Baga Coastal Promenade', 'Beach', 'Vibrant beaches, water sports, and coastal leisure zones', 3500000, 1);

-- DEMO USERS (Password: 'Demo@123')
INSERT INTO `users` (`id`, `role_id`, `full_name`, `email`, `password_hash`, `mobile`, `designation`, `state_id`, `district_id`, `police_station_id`, `property_id`, `status`) VALUES
(1, 1, 'Vikram Malhotra (Super Admin)', 'admin@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9811001100', 'Director General of Systems', 1, 1, 1, NULL, 'Active'),
(2, 7, 'Rajesh Sen (Grand Heritage)', 'hotel@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9830012345', 'Managing Proprietor', 1, 1, 1, 1, 'Active'),
(3, 5, 'Inspector Ananya Roy', 'police@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9840056789', 'Station Officer (In-Charge)', 1, 1, 1, NULL, 'Active'),
(4, 6, 'Dr. Arindam Bose', 'tourism@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9850067890', 'Chief Tourism Intelligence Officer', 1, 1, 1, NULL, 'Active'),
(5, 2, 'Meenakshi Sundaram', 'stateadmin@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9860078901', 'State Tourism Secretary', 1, NULL, NULL, NULL, 'Active'),
(6, 3, 'Devendra Rathore', 'district@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9870089012', 'District Tourism Officer', 1, 1, NULL, NULL, 'Active'),
(7, 4, 'Superintendent S. K. Verma', 'policeadmin@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9880090123', 'Superintendent of Police (Safety)', 1, 1, 1, NULL, 'Active'),
(8, 8, 'Pooja Sharma (Reception)', 'staff@atithya360.demo', '$2y$10$tM/6Q1d5jXUuB5q3yPzF3O2oM6QW8bYhN3k7vR9zL1mX2pA4sC6Gu', '+91 9890011223', 'Front Desk Executive', 1, 1, 1, 1, 'Active');

-- PROPERTIES
INSERT INTO `properties` (`id`, `property_code`, `name`, `property_type`, `owner_id`, `owner_name`, `contact_number`, `email`, `address`, `city`, `district_id`, `state_id`, `pincode`, `police_station_id`, `license_number`, `registration_number`, `room_capacity`, `contact_person`, `status`) VALUES
(1, 'PROP-KOL-1001', 'The Grand Heritage Park Hotel', 'Hotel', 2, 'Rajesh Sen', '+91 33 4001 8800', 'contact@grandheritagekol.demo', '18/A Park Street', 'Kolkata', 1, 1, '700016', 1, 'LIC-WB-2024-8891', 'REG-TRM-KOL-0192', 45, 'Subrata Das', 'Active'),
(2, 'PROP-KOL-1002', 'Salt Lake Eco Boutique Homestay', 'Homestay', 2, 'Sunita Guha', '+91 33 2358 1200', 'stay@saltlakehomestay.demo', 'Sector 3, Salt Lake City', 'Kolkata', 1, 1, '700098', 1, 'LIC-WB-2024-8892', 'REG-TRM-KOL-0193', 8, 'Sunita Guha', 'Active'),
(3, 'PROP-DAR-2001', 'Pine Valley Himalayan Retreat', 'Resort', NULL, 'Pemba Sherpa', '+91 354 225 6700', 'stay@pinevalleyresort.demo', 'Mall Road Above Chowrasta', 'Darjeeling', 2, 1, '734101', 2, 'LIC-WB-2024-4412', 'REG-TRM-DAR-0051', 28, 'Pemba Sherpa', 'Active'),
(4, 'PROP-DAR-2002', 'Misty Mountain Tea Homestay', 'Homestay', NULL, 'Anita Lepcha', '+91 354 227 1100', 'anita@mistytea.demo', 'Lebong Valley Road', 'Darjeeling', 2, 1, '734105', 2, 'LIC-WB-2024-4419', 'REG-TRM-DAR-0058', 6, 'Anita Lepcha', 'Active'),
(5, 'PROP-PUR-3001', 'Sea Breeze Grand Golden Beach', 'Hotel', NULL, 'Manoj Tripathy', '+91 6752 230 400', 'info@puriseabreeze.demo', 'Chakratirtha Marine Drive', 'Puri', 4, 2, '752002', 3, 'LIC-OD-2024-7711', 'REG-TRM-PUR-0104', 55, 'Debasis Panda', 'Active'),
(6, 'PROP-PUR-3002', 'Niladri Coastal Pilgrims Lodge', 'Lodge', NULL, 'Gourhari Mohapatra', '+91 6752 221 800', 'niladri@lodgedemo.demo', 'Grand Road Near Temple', 'Puri', 4, 2, '752001', 3, 'LIC-OD-2024-7718', 'REG-TRM-PUR-0112', 20, 'Gourhari Mohapatra', 'Active'),
(7, 'PROP-JAI-4001', 'Royal Rajputana Heritage Haveli', 'Hotel', NULL, 'Bhairon Singh', '+91 141 262 4400', 'heritage@rajputanahaveli.demo', 'Amber Road, Old Walled City', 'Jaipur', 6, 3, '302002', 4, 'LIC-RJ-2024-1022', 'REG-TRM-JAI-0321', 35, 'Manish Rathore', 'Active'),
(8, 'PROP-JAI-4002', 'Pink City Urban Backpackers Hostel', 'Guest House', NULL, 'Rohan Verma', '+91 141 401 2299', 'hostel@pinkcitystay.demo', 'MI Road Sindhi Camp', 'Jaipur', 6, 3, '302001', 4, 'LIC-RJ-2024-1035', 'REG-TRM-JAI-0345', 18, 'Rohan Verma', 'Active'),
(9, 'PROP-UDR-5001', 'Lakeview Palace Boutique Suites', 'Resort', NULL, 'Fateh Singh Mehta', '+91 294 252 8800', 'lakeview@udaipurpalace.demo', 'Hanuman Ghat Pichola', 'Udaipur', 7, 3, '313001', 5, 'LIC-RJ-2024-3311', 'REG-TRM-UDR-0144', 24, 'Dilip Joshi', 'Active'),
(10, 'PROP-UDR-5002', 'Aravalli Greens Farm & Homestay', 'Homestay', NULL, 'Kalyan Singh', '+91 294 288 4411', 'aravalli@farmstay.demo', 'Badi Lake Road', 'Udaipur', 7, 3, '313011', 5, 'LIC-RJ-2024-3329', 'REG-TRM-UDR-0158', 10, 'Kalyan Singh', 'Active'),
(11, 'PROP-SHM-6001', 'Cedar & Pines Colonial Grand', 'Hotel', NULL, 'Surinder Dogra', '+91 177 280 4400', 'cedar@shimlagrand.demo', 'The Mall Near Lift', 'Shimla', 8, 4, '171001', 6, 'LIC-HP-2024-5501', 'REG-TRM-SHM-0211', 40, 'Virender Thakur', 'Active'),
(12, 'PROP-SHM-6002', 'Snow Crest Wooden Cottage', 'Homestay', NULL, 'Ramesh Negi', '+91 177 266 1122', 'snowcrest@cottage.demo', 'Mashobra Forest Trail', 'Shimla', 8, 4, '171007', 6, 'LIC-HP-2024-5519', 'REG-TRM-SHM-0230', 8, 'Ramesh Negi', 'Active'),
(13, 'PROP-KLU-7001', 'Solang Adventure Riverside Resort', 'Resort', NULL, 'Dinesh Sharma', '+91 1902 258 700', 'solang@riversideresort.demo', 'Old Manali Bridge Road', 'Manali', 9, 4, '175131', 7, 'LIC-HP-2024-9102', 'REG-TRM-KLU-0402', 32, 'Dinesh Sharma', 'Active'),
(14, 'PROP-KLU-7002', 'Apple Orchard Eco Camp & Cabins', 'Guest House', NULL, 'Harish Kapoor', '+91 1902 245 611', 'apple@ecocamp.demo', 'Naggar Castle View', 'Manali', 9, 4, '175130', 7, 'LIC-HP-2024-9118', 'REG-TRM-KLU-0419', 14, 'Harish Kapoor', 'Active'),
(15, 'PROP-KOC-8001', 'Fort Kochi Heritage Spice Villa', 'Hotel', NULL, 'Thomas Varghese', '+91 484 221 8800', 'spicevilla@fortkochi.demo', 'Princess Street', 'Kochi', 10, 5, '682001', 8, 'LIC-KL-2024-2041', 'REG-TRM-KOC-0301', 22, 'Mathew Paul', 'Active'),
(16, 'PROP-IDK-8002', 'Munnar Mist Plantation Homestay', 'Homestay', NULL, 'Joseph Kurian', '+91 4865 230 110', 'munnar@misthomestay.demo', 'Chithirapuram Post', 'Munnar', 11, 5, '685565', 8, 'LIC-KL-2024-2099', 'REG-TRM-IDK-0118', 12, 'Joseph Kurian', 'Active'),
(17, 'PROP-GA-9001', 'Golden Palms Beachside Resort', 'Resort', NULL, 'Anthony D\'Souza', '+91 832 227 9900', 'palms@beachresortgoa.demo', 'Calangute Ocean Drive', 'North Goa', 12, 6, '403516', 9, 'LIC-GA-2024-6012', 'REG-TRM-GOA-0811', 60, 'Maria Fernandes', 'Active'),
(18, 'PROP-GA-9002', 'Portuguese Heritage Villa Stay', 'Homestay', NULL, 'Francisco Coutinho', '+91 832 242 3311', 'villa@heritagegoa.demo', 'Fontainhas Latin Quarter', 'North Goa', 12, 6, '403001', 9, 'LIC-GA-2024-6033', 'REG-TRM-GOA-0842', 9, 'Francisco Coutinho', 'Active'),
(19, 'PROP-UK-1001', 'Ganga Waters Yoga & Wellness Retreat', 'Resort', NULL, 'Swami Muktanand', '+91 135 244 5500', 'ganga@yogaretreat.demo', 'Tapovan Near Laxman Jhula', 'Rishikesh', 14, 7, '249192', 10, 'LIC-UK-2024-8119', 'REG-TRM-DDN-0205', 26, 'Rohit Nautiyal', 'Active'),
(20, 'PROP-KOL-1003', 'Hooghly View Heritage Lodge', 'Lodge', NULL, 'Debabrata Ghosh', '+91 33 2230 9911', 'hooghly@heritagelodge.demo', 'Strand Road Ghat Complex', 'Kolkata', 1, 1, '700001', 1, 'LIC-WB-2024-8905', 'REG-TRM-KOL-0210', 16, 'Debabrata Ghosh', 'Pending'),
(21, 'PROP-MUM-1101', 'Marine Drive City Business Suites', 'Hotel', NULL, 'Ketan Parikh', '+91 22 2288 7700', 'marine@citysuites.demo', 'Churchgate Station Road', 'Mumbai', 15, 8, '400020', 1, 'LIC-MH-2024-5102', 'REG-TRM-MUM-0901', 50, 'Nilesh Sawant', 'Active');

-- ROOMS
INSERT INTO `rooms` (`property_id`, `room_number`, `room_type`, `max_occupancy`, `status`) VALUES
(1, '101', 'Deluxe', 2, 'Occupied'),
(1, '102', 'Deluxe', 2, 'Occupied'),
(1, '103', 'Standard', 2, 'Available'),
(1, '104', 'Standard', 2, 'Available'),
(1, '201', 'Suite', 4, 'Occupied'),
(1, '202', 'Suite', 4, 'Available'),
(1, '203', 'Deluxe', 2, 'Occupied'),
(1, '301', 'Standard', 2, 'Maintenance'),
(2, 'Room-A', 'Deluxe', 3, 'Occupied'),
(2, 'Room-B', 'Standard', 2, 'Available'),
(3, 'Cottage-1', 'Cottage', 4, 'Occupied'),
(3, 'Cottage-2', 'Cottage', 4, 'Occupied'),
(3, 'Room-101', 'Deluxe', 2, 'Available'),
(5, '201-SeaView', 'Suite', 3, 'Occupied'),
(5, '202-SeaView', 'Deluxe', 2, 'Occupied'),
(5, '105-Garden', 'Standard', 2, 'Available'),
(7, 'Haveli-01', 'Suite', 4, 'Occupied'),
(7, 'Haveli-02', 'Deluxe', 2, 'Occupied'),
(17, 'BeachVilla-1', 'Villa', 6, 'Occupied'),
(17, 'BeachVilla-2', 'Villa', 6, 'Available');

-- GUESTS
INSERT INTO `guests` (`id`, `guest_code`, `guest_type`, `full_name`, `dob`, `gender`, `mobile`, `email`, `nationality`, `address`, `city`, `state_id`, `country_id`, `emergency_contact`, `purpose_of_visit`, `passport_number`, `visa_number`, `visa_type`, `foreign_verification_status`) VALUES
(1, 'GST-IND-1001', 'Indian Guest', 'Amitabh Sengupta', '1984-05-14', 'Male', '+91 9831122334', 'amitabh.sen@example.com', 'Indian', '45 Southern Avenue', 'Kolkata', 1, 1, '+91 9831199887', 'Tourism', NULL, NULL, NULL, 'Not Applicable'),
(2, 'GST-IND-1002', 'Indian Guest', 'Priyanka Banerjee', '1990-11-20', 'Female', '+91 9830998877', 'priyanka.b@example.com', 'Indian', '12 Salt Lake Sector 2', 'Kolkata', 1, 1, '+91 9830112233', 'Business', NULL, NULL, NULL, 'Not Applicable'),
(3, 'GST-IND-1003', 'Indian Guest', 'Ramesh Chandra Panda', '1976-03-12', 'Male', '+91 9437102030', 'ramesh.panda@example.com', 'Indian', 'Near Sun Temple Rd', 'Bhubaneswar', 2, 1, '+91 9437111222', 'Tourism', NULL, NULL, NULL, 'Not Applicable'),
(4, 'GST-IND-1004', 'Indian Guest', 'Sneha Deshmukh', '1995-07-08', 'Female', '+91 9820011223', 'sneha.deshmukh@example.com', 'Indian', '78 Bandra West', 'Mumbai', 8, 1, '+91 9820099887', 'Tourism', NULL, NULL, NULL, 'Not Applicable'),
(5, 'GST-IND-1005', 'Indian Guest', 'Arjun Singh Shekhawat', '1988-09-25', 'Male', '+91 9414012345', 'arjun.shekhawat@example.com', 'Indian', '14 Vaishali Nagar', 'Jaipur', 3, 1, '+91 9414099887', 'Business', NULL, NULL, NULL, 'Not Applicable'),
(6, 'GST-IND-1006', 'Indian Guest', 'Kavitha Ramachandran', '1992-02-18', 'Female', '+91 9840076543', 'kavitha.r@example.com', 'Indian', '90 Anna Nagar', 'Chennai', 9, 1, '+91 9840011223', 'Tourism', NULL, NULL, NULL, 'Not Applicable'),
(7, 'GST-IND-1007', 'Indian Guest', 'Rahul Nair', '1987-12-04', 'Male', '+91 9847055443', 'rahul.nair@example.com', 'Indian', '22 Marine Drive', 'Kochi', 5, 1, '+91 9847011223', 'Transit', NULL, NULL, NULL, 'Not Applicable'),
(8, 'GST-IND-1008', 'Indian Guest', 'Deepak Verma', '1982-08-30', 'Male', '+91 9810033221', 'deepak.verma@example.com', 'Indian', 'B-4 Connaught Place', 'New Delhi', 12, 1, '+91 9810099887', 'Business', NULL, NULL, NULL, 'Not Applicable'),
(9, 'GST-IND-1009', 'Indian Guest', 'Shalini Mishra', '1993-06-15', 'Female', '+91 9450011223', 'shalini.m@example.com', 'Indian', 'Civil Lines', 'Patna', 13, 1, '+91 9450099887', 'Tourism', NULL, NULL, NULL, 'Not Applicable'),
(10, 'GST-IND-1010', 'Indian Guest', 'Abhishek Agarwal', '1989-10-10', 'Male', '+91 9897011223', 'abhishek.agarwal@example.com', 'Indian', 'Mall Road', 'Mussoorie', 7, 1, '+91 9897099887', 'Tourism', NULL, NULL, NULL, 'Not Applicable'),
(16, 'GST-FOR-2001', 'Foreign Visitor', 'John Alexander Smith', '1982-04-12', 'Male', '+1 415 555 2671', 'john.smith@example.org', 'American', '742 Evergreen Terrace', 'San Francisco', NULL, 3, '+1 415 555 9999', 'Tourism', 'PASS-USA-998811', 'VISA-IND-T-88192', 'e-Tourist (30 Days)', 'Verified'),
(17, 'GST-FOR-2002', 'Foreign Visitor', 'Emily Charlotte Watson', '1988-08-19', 'Female', '+44 20 7946 0912', 'emily.watson@example.co.uk', 'British', '14 Kensington High St', 'London', NULL, 4, '+44 20 7946 0000', 'Tourism', 'PASS-GBR-772233', 'VISA-IND-T-77201', 'e-Tourist (1 Year)', 'Verified'),
(18, 'GST-FOR-2003', 'Foreign Visitor', 'Lucas Schneider', '1990-02-28', 'Male', '+49 30 1234 5678', 'lucas.schneider@example.de', 'German', '42 Friedrichstrasse', 'Berlin', NULL, 5, '+49 30 1234 9999', 'Tourism', 'PASS-DEU-445566', 'VISA-IND-T-44910', 'e-Tourist (30 Days)', 'Verified'),
(19, 'GST-FOR-2004', 'Foreign Visitor', 'Clara Dubois', '1993-11-03', 'Female', '+33 1 42 68 55 00', 'clara.dubois@example.fr', 'French', '18 Rue de Rivoli', 'Paris', NULL, 6, '+33 1 42 68 99 99', 'Education', 'PASS-FRA-332211', 'VISA-IND-S-33109', 'Student Visa', 'Verified'),
(20, 'GST-FOR-2005', 'Foreign Visitor', 'Liam James O\'Connor', '1985-06-17', 'Male', '+61 2 9374 4000', 'liam.oconnor@example.com.au', 'Australian', '55 George St', 'Sydney', NULL, 7, '+61 2 9374 9999', 'Tourism', 'PASS-AUS-881144', 'VISA-IND-T-88220', 'e-Tourist (5 Years)', 'Verified'),
(21, 'GST-FOR-2006', 'Foreign Visitor', 'Md. Tanvir Hossain', '1987-03-09', 'Male', '+880 1711 223344', 'tanvir.hossain@example.com.bd', 'Bangladeshi', 'Dhanmondi R/A', 'Dhaka', NULL, 2, '+880 1711 998877', 'Medical', 'PASS-BGD-110022', 'VISA-IND-M-11204', 'Medical Visa', 'Verified'),
(23, 'GST-FOR-2008', 'Foreign Visitor', 'Sofia Rossi', '1989-12-14', 'Female', '+39 06 698 1234', 'sofia.rossi@example.it', 'Italian', 'Via del Corso 22', 'Rome', NULL, 14, '+39 06 698 9999', 'Tourism', 'PASS-ITA-551122', 'VISA-IND-T-55819', 'e-Tourist (30 Days)', 'Needs Review');

-- GUEST DOCUMENTS
INSERT INTO `guest_documents` (`id`, `guest_id`, `document_type`, `document_reference`, `file_path`, `verification_status`, `uploaded_at`) VALUES
(1, 1, 'Driving License', 'DL-WB-19980011223', 'uploads/documents/doc_demo_dl_1.pdf', 'Verified', '2026-09-18 10:30:00'),
(2, 2, 'Voter ID', 'VTR-WB-0991823', 'uploads/documents/doc_demo_vtr_2.pdf', 'Verified', '2026-09-19 11:15:00'),
(3, 3, 'National ID Card', 'NID-OD-8819201', 'uploads/documents/doc_demo_nid_3.pdf', 'Verified', '2026-09-20 14:00:00'),
(6, 16, 'Passport', 'PASS-USA-998811', 'uploads/documents/doc_demo_pass_16.pdf', 'Verified', '2026-09-19 16:30:00'),
(7, 16, 'Visa', 'VISA-IND-T-88192', 'uploads/documents/doc_demo_visa_16.pdf', 'Verified', '2026-09-19 16:35:00'),
(11, 23, 'Passport', 'PASS-ITA-551122', 'uploads/documents/doc_demo_pass_23.pdf', 'Needs Review', '2026-09-22 10:15:00');

-- STAYS
INSERT INTO `stays` (`id`, `stay_code`, `guest_id`, `property_id`, `room_id`, `num_guests`, `checkin_time`, `expected_checkout`, `actual_checkout`, `stay_status`, `primary_destination_id`, `remarks`) VALUES
(1, 'STY-2026-1001', 1, 1, 1, 2, '2026-09-20 12:00:00', '2026-09-24 11:00:00', NULL, 'Checked In', 1, 'Standard deluxe booking for cultural heritage visit'),
(2, 'STY-2026-1002', 2, 1, 2, 1, '2026-09-21 14:30:00', '2026-09-23 11:00:00', NULL, 'Checked In', 1, 'Corporate transit guest'),
(3, 'STY-2026-1003', 16, 1, 5, 2, '2026-09-19 16:00:00', '2026-09-25 10:00:00', NULL, 'Checked In', 1, 'Foreign visitor registered with valid e-Tourist visa'),
(4, 'STY-2026-1004', 3, 5, 14, 2, '2026-09-20 11:30:00', '2026-09-23 10:00:00', NULL, 'Checked In', 3, 'Beach tourism vacation stay'),
(5, 'STY-2026-1005', 17, 3, 11, 2, '2026-09-18 15:00:00', '2026-09-23 11:00:00', NULL, 'Checked In', 2, 'Himalayan sunrise & tea tour'),
(6, 'STY-2026-1006', 4, 7, 17, 3, '2026-09-21 13:00:00', '2026-09-24 11:00:00', NULL, 'Checked In', 4, 'Royal heritage itinerary'),
(7, 'STY-2026-1007', 18, 17, 19, 4, '2026-09-19 17:00:00', '2026-09-26 10:00:00', NULL, 'Checked In', 10, 'Beachfront vacation package'),
(8, 'STY-2026-1008', 5, 1, 7, 1, '2026-09-22 09:00:00', '2026-09-23 18:00:00', NULL, 'Checked In', 1, 'Single occupancy business check-in'),
(9, 'STY-2026-1009', 21, 1, 2, 2, '2026-09-15 11:00:00', '2026-09-18 10:00:00', '2026-09-18 09:45:00', 'Checked Out', 1, 'Medical tourism visit completed smoothly'),
(10, 'STY-2026-1010', 6, 2, 9, 2, '2026-09-14 14:00:00', '2026-09-17 11:00:00', '2026-09-17 10:30:00', 'Checked Out', 1, 'Eco homestay leisure stay');

-- ALERTS
INSERT INTO `alerts` (`id`, `alert_code`, `alert_type`, `severity`, `entity_type`, `entity_id`, `title`, `message`, `status`, `assigned_to`) VALUES
(1, 'ALT-2026-01', 'Document Verification Pending', 'Medium', 'GuestDocument', 11, 'Foreign Visitor Document Review Flagged', 'Document reference PASS-ITA-551122 metadata requires standard review for clearance confirmation.', 'Open', 3),
(2, 'ALT-2026-02', 'Property Verification Pending', 'Low', 'Property', 20, 'New Accommodation Registration Pending Inspection', 'Hooghly View Heritage Lodge has completed registration and awaits District Police Station site verification.', 'Under Review', 3),
(3, 'ALT-2026-03', 'Unusual Data Pattern', 'Low', 'Property', 17, 'High Seasonal Occupancy Velocity Flag', 'Golden Palms Beachside Resort has recorded 92% occupancy for consecutive 4 days during weekend festival.', 'Resolved', 4),
(4, 'ALT-2026-04', 'Duplicate Guest Record', 'Low', 'Guest', 1, 'Possible Secondary Mobile Match', 'Guest Amitabh Sengupta matches previous check-in history record from June 2026 at Darjeeling.', 'Resolved', 3);

-- AUDIT LOGS
INSERT INTO `audit_logs` (`id`, `user_id`, `user_email`, `user_role`, `action`, `entity`, `entity_id`, `ip_address`, `user_agent`, `details`) VALUES
(1, 1, 'admin@atithya360.demo', 'Super Admin', 'System Initialization', 'System', 'SYSTEM', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Initial master configuration and schema deployment verified.'),
(2, 2, 'hotel@atithya360.demo', 'Property Owner', 'Guest Check-In', 'Stay', 'STY-2026-1001', '192.168.1.45', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Registered Indian Guest check-in for Room 101 with verified DL document.'),
(3, 2, 'hotel@atithya360.demo', 'Property Owner', 'Guest Check-In', 'Stay', 'STY-2026-1003', '192.168.1.45', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Registered Foreign Visitor John Alexander Smith (USA) in Room 201 with verified Visa & Passport metadata.'),
(4, 3, 'police@atithya360.demo', 'Police Officer', 'Authorized Guest Search', 'Guest', 'SEARCH-Q', '10.0.4.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Executed authorized station jurisdiction search for active check-ins.'),
(5, 4, 'tourism@atithya360.demo', 'Tourism Admin', 'Export Tourism Report', 'Report', 'REP-MNTH-09', '10.0.5.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Generated state-wide and district-level monthly visitor trend report.');

-- SYSTEM SETTINGS
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `category`, `description`) VALUES
('platform_name', 'ATITHYA360', 'General', 'Platform Name'),
('platform_tagline', 'Smarter Stays. Safer Destinations.', 'General', 'Official System Tagline'),
('demo_mode', '1', 'System', 'Enables demonstration mode with synthetic benchmark records'),
('require_document_upload', '1', 'Security', 'Requires identity document metadata attachment prior to digital check-in confirmation'),
('max_upload_size_mb', '10', 'Security', 'Maximum permitted file upload size in megabytes'),
('allowed_document_extensions', 'pdf,jpg,jpeg,png', 'Security', 'Permitted file MIME types for identity document attachments'),
('police_auto_alert_threshold_days', '30', 'Security', 'Flag stays exceeding 30 consecutive days for administrative review');

SET FOREIGN_KEY_CHECKS = 1;
