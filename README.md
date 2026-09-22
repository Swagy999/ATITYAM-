# ATITHYA360 – Digital Guest Registration, Accommodation Management & Tourism Intelligence Platform

> **Tagline:** *"Smarter Stays. Safer Destinations."*  
> **Classification:** Comprehensive Prototype & Architecture Demonstration  
> **Tech Stack:** React 18 (Vite) + PHP 8+ REST API + MySQL 8+ + Azure Data Engineering Architecture

---

## 1. Executive Summary & Objective

**ATITHYA360** is a secure, multi-tier web platform engineered to modernize accommodation governance across states and tourist circuits. It connects three critical stakeholder domains onto a single zero-trust foundation:

1. **Accommodation Operators (Hotels, Homestays, Resorts, Guest Houses, Lodges):** Fast 60-second digital guest check-ins, paperless document metadata recording, room inventory tracking, and automated regulatory compliance.
2. **Police & Public Safety Authorities:** Real-time jurisdictional visibility, authorized search parameters, property inspection registers, and human-in-the-loop review queues.
3. **Tourism Development Boards & State Magisterial Offices:** Macro tourism intelligence, monthly visitor velocity forecasting, destination carrying capacity tracking, international arrival analytics, and exportable audit reports.

---

## 2. High-Level System Architecture

```
+---------------------------------------------------------------------------------------+
|                                    REACT FRONTEND                                     |
|  - Public Portal: Home, About, How It Works, Features, Hoteliers, Authorities, Contact|
|  - 4 Operational Terminals: Super Admin, Property Owner, Police Officer, Tourism Admin|
|  - Modern Visuals: Enterprise Glass Theme, Lucide Icons, Dynamic Chart.js Analytics   |
+---------------------------------------------------------------------------------------+
                                           |
                                [HTTPS / RESTful JSON]
                                           |
+---------------------------------------------------------------------------------------+
|                                 PHP 8+ REST API BACKEND                               |
|  - Modular API Controllers (/api/auth, /api/properties, /api/guests, /api/stays...)   |
|  - Middleware: CORS, Signed Token Auth, Role-Based Access Control (RBAC), Rate Limits |
|  - Security: Input Sanitization, Bcrypt Hashing, Secure File Manager, Audit Logger    |
+---------------------------------------------------------------------------------------+
                                           |
                                     [PDO Driver]
                                           |
+---------------------------------------------------------------------------------------+
|                                    MySQL 8+ DATABASE                                  |
|  - Fully Normalized Relational Schema (20+ Tables with Foreign Keys & Indexes)        |
|  - Master Data: States, Districts, Police Stations, Destinations, Roles, Permissions  |
|  - Transactional: Properties, Rooms, Guests, Documents, Stays, Alerts, Audit Logs     |
+---------------------------------------------------------------------------------------+
                                           |
                           [Cloud Data Engineering Pipeline]
                                           |
+---------------------------------------------------------------------------------------+
|                       AZURE MEDALLION LAKEHOUSE ARCHITECTURE                          |
|  MySQL -> Azure Data Factory -> ADLS Gen2 (Bronze) -> Azure Databricks (Silver PySpark|
|  Cleansing) -> Delta Lake (Gold Aggregates) -> Power BI / Tourism Predictive Engines  |
+---------------------------------------------------------------------------------------+
```

---

## 3. Demo Login Credentials

For demonstration, 4 specialized stakeholder personas are pre-configured with synthetic data:

| Role Persona | Email Address | Password | Operational Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@atithya360.demo` | `Demo@123` | Full platform governance, user administration, system settings, global audit logs |
| **Property Owner** | `hotel@atithya360.demo` | `Demo@123` | Grand Heritage Hotel terminal, digital check-in/out, room matrix, guest directory |
| **Police Officer** | `police@atithya360.demo` | `Demo@123` | Park Street Station command, authorized guest search, property audit, security alerts |
| **Tourism Admin** | `tourism@atithya360.demo` | `Demo@123` | Macro analytics, Chart.js trend curves, origin countries, destination capacity, CSV exports |
| **State Admin** | `stateadmin@atithya360.demo` | `Demo@123` | State-level oversight, district performance, and policy metrics |
| **District Admin** | `district@atithya360.demo` | `Demo@123` | District tourism operations and local inspection tracking |
| **Police Admin** | `policeadmin@atithya360.demo` | `Demo@123` | District police superintendency and high-priority investigations |
| **Property Staff** | `staff@atithya360.demo` | `Demo@123` | Front-desk digital guest check-in, check-out, and room updates |

*(Note: In the live UI, you can also use the **Demo Roles** 1-click switcher in the top navigation bar).*

---

## 4. Quick Start & Installation (XAMPP / WAMP / Standalone)

### Prerequisites:
- **PHP 8.0+** with `pdo`, `pdo_mysql`, `json`, `session` extensions
- **MySQL 8.0+** (or MariaDB 10.4+)
- **Node.js 18+** & `npm`

### Step 1: Database Setup (XAMPP / WAMP)
1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`) or MySQL CLI.
3. Import the database schema and synthetic dataset:
   ```bash
   mysql -u root -p < database.sql
   ```
   *(This creates the `atithya360` database, 20+ tables, and loads 20+ accommodations, 100+ guests, 50+ stays, alerts, and audit logs).*

### Step 2: Configure Backend Environment
1. In `backend/.env` (or copy from `.env.example`):
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=atithya360
   DB_USER=root
   DB_PASSWORD=
   JWT_SECRET=atithya360_super_secret_enterprise_key_2026
   ```
2. Start the PHP API server:
   ```bash
   cd backend
   php -S localhost:8000
   ```

### Step 3: Start React Frontend
1. In a new terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.

---

## 5. Directory Structure

```
atithya360/
├── backend/
│   ├── config/
│   │   ├── config.php             # System constants and environment loader
│   │   └── database.php           # PDO connection with MySQL 8+ support
│   ├── middleware/
│   │   ├── auth.php               # Signed JWT token generator and validator
│   │   ├── cors.php               # CORS cross-origin handler
│   │   └── role.php               # Role-Based Access Control (RBAC) guard
│   ├── utils/
│   │   ├── audit.php              # Immutable security audit logger
│   │   ├── response.php           # Standardized JSON response formatter
│   │   ├── upload.php             # Secure non-executable file uploader
│   │   └── validation.php         # Input sanitization and validator
│   ├── uploads/
│   │   └── documents/             # Secure storage for document metadata
│   ├── api/
│   │   ├── auth/                  # login.php, register.php, logout.php, me.php
│   │   ├── properties/            # list.php, create.php, details.php, update.php, verify.php
│   │   ├── guests/                # list.php, create.php, details.php, update.php
│   │   ├── stays/                 # checkin.php, checkout.php, list.php
│   │   ├── documents/             # upload.php, verify.php
│   │   ├── reports/               # monthly.php, export-csv.php
│   │   ├── analytics/             # overview.php, monthly.php, state-wise.php, country-wise.php, destination.php
│   │   ├── alerts/                # list.php, update-status.php
│   │   ├── police/                # search.php, property-search.php
│   │   ├── users/                 # list.php, create.php, update.php
│   │   └── admin/                 # audit-logs.php, master-data.php, system-settings.php
│   ├── database.sql               # MySQL 8+ Schema & Synthetic Seed Dataset
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, Sidebar, Footer, StatCard, Modal, AlertBadge, ProtectedRoute
│   │   ├── context/               # AuthContext.jsx with 1-click quick role switcher
│   │   ├── services/              # api.js, services.js (Axios API client)
│   │   ├── pages/
│   │   │   ├── public/            # Home, About, HowItWorks, ForHotels, ForAuthorities, TourismIntelligence, Contact
│   │   │   ├── auth/              # Login, Register, ForgotPassword
│   │   │   ├── property/          # PropertyDashboard (Fast Check-in/out, Room matrix)
│   │   │   ├── police/            # PoliceDashboard (Authorized search, Registry, Alerts)
│   │   │   ├── tourism/           # TourismDashboard (Chart.js graphs, CSV reporting)
│   │   │   └── admin/             # AdminDashboard (Users, Audit logs, Settings)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── data-engineering/
│       ├── architecture.md        # End-to-end Azure lakehouse blueprint
│       ├── etl-design.md          # Watermark CDC ingestion specification
│       ├── data-model.md          # Dimensional modeling & Star Schema
│       ├── medallion-architecture.md # Bronze -> Silver -> Gold PySpark specs
│       └── pipeline-design.md     # ADF triggers & Databricks orchestration
├── database.sql                   # Root SQL dump for quick import
├── README.md
└── .env.example
```

---

## 6. REST API Reference

| Endpoint | Method | Role Scope | Description |
| :--- | :---: | :--- | :--- |
| `/api/auth/login.php` | `POST` | Public | Authenticates user & issues JWT token |
| `/api/auth/register.php` | `POST` | Public | Self-registration for property owners |
| `/api/auth/me.php` | `GET` | Authenticated | Fetches active identity & permissions |
| `/api/properties/list.php` | `GET` | Scoped | Returns accommodations filtered by role scope |
| `/api/properties/create.php` | `POST` | Owner / Admin | Creates property & provisions initial room inventory |
| `/api/properties/details.php` | `GET` | Scoped | Returns property profile, rooms, and active stays |
| `/api/properties/verify.php` | `POST` | Authorities | Verifies/approves accommodation registration |
| `/api/stays/checkin.php` | `POST` | Hotelier / Staff | Digital check-in for Indian/Foreign guests & allocates room |
| `/api/stays/checkout.php` | `POST` | Hotelier / Staff | Completes stay, records checkout time, releases room |
| `/api/stays/list.php` | `GET` | Scoped | Lists active & past stays with date/status filters |
| `/api/police/search.php` | `GET` | Police Officers | Authorized parameter search with encrypted logging |
| `/api/police/property-search.php` | `GET` | Police Officers | Jurisdiction property inspection registry |
| `/api/analytics/overview.php` | `GET` | Authenticated | High-level platform KPIs (occupancy, guests, properties) |
| `/api/analytics/monthly.php` | `GET` | Authenticated | 12-month visitor velocity trend dataset |
| `/api/reports/monthly.php` | `GET` | Authenticated | Multi-parameter filterable reporting endpoint |
| `/api/reports/export-csv.php` | `GET` | Authenticated | Direct streaming CSV export of stay records |
| `/api/alerts/list.php` | `GET` | Authorities | Incident and verification review queue |
| `/api/alerts/update-status.php`| `POST` | Authorities | Resolves/updates alert status with officer notes |
| `/api/admin/audit-logs.php` | `GET` | Super Admin | System security audit trail with IP & user agent |

---

## 7. Future Azure Cloud Data Engineering Blueprint

The database and APIs are structured to serve as the upstream transactional source for an **Azure Medallion Lakehouse**:

- **Bronze Layer (ADLS Gen2):** Azure Data Factory pulls incremental changes using Watermark CDC and stores raw append-only Parquet files.
- **Silver Layer (Delta Lake):** Azure Databricks cleanses data, validates schemas, standardizes state/country codes, and pseudonymizes sensitive PII.
- **Gold Layer (Delta Lake):** Star schema datamarts pre-compute tourist velocity (`gold_guest_daily_velocity`), accommodation occupancy (`gold_property_occupancy_summary`), and country origin intelligence for direct query in Microsoft Fabric & Power BI.

*(Detailed architecture, PySpark scripts, and dimensional models are provided in [docs/data-engineering/](file:///C:/Users/user/.gemini/antigravity-ide/scratch/atithya360/docs/data-engineering/architecture.md)).*

---

## 8. Security & Privacy Disclosures

- **Synthetic Data Notice:** All personal names, phone numbers, passport references, and registration codes in this project are 100% synthetic demonstration data.
- **No Real Government Integration:** This is a portfolio prototype and does not connect to real government immigration, police, or Aadhaar APIs.
- **Security Engineering:** Passwords hashed with Bcrypt (`password_hash()`), parameterized PDO SQL statements preventing SQL injection, XSS input escaping, MIME-type file upload validation, and immutable audit logs.

---

## 9. Verification & Testing Checklist

- [x] **Authentication:** Bcrypt login, token validation, 1-click demo role switching.
- [x] **Property Management:** Multi-state property directory, room inventory allocation.
- [x] **Digital Check-In / Check-Out:** Fast paperless check-in for Indian & Foreign tourists, live room occupancy toggling.
- [x] **Police Terminal:** Authorized parameter query, jurisdiction property audits, alert resolution queue.
- [x] **Tourism Analytics:** Interactive Chart.js monthly trend velocity, origin distributions, destination capacity tables.
- [x] **Reporting & CSV Export:** Multi-filter query engine with streaming CSV downloads.
- [x] **Audit Logging:** Automated logging of logins, searches, check-ins, and data exports.
- [x] **Responsive UI:** Works on desktop, tablet, and mobile with dark enterprise aesthetics.
