# ATITHYA360 – Enterprise Cloud Data Engineering Architecture

**Tagline:** *"Smarter Stays. Safer Destinations."*  
**Scope:** Medallion Lakehouse Architecture & Cloud Analytics Integration Blueprint

---

## 1. High-Level Architecture Overview

ATITHYA360 captures real-time accommodation, guest check-in/out, document verification metadata, and police jurisdictional activity via a normalized **MySQL 8+ OLTP** database.

To support state-wide tourism forecasting, law enforcement spatial analytics, destination capacity planning, and automated macro-economic reporting, ATITHYA360 integrates with **Microsoft Azure Data Engineering services** using the **Medallion Architecture (Bronze $\rightarrow$ Silver $\rightarrow$ Gold)**.

```
+----------------------------------------------------------------------------------------------------+
|                                    SOURCE OLTP TIER (MySQL 8+)                                    |
|  Tables: users, properties, rooms, guests, guest_documents, stays, alerts, destinations, audit_logs|
+----------------------------------------------------------------------------------------------------+
                                                  │
                                     [Azure Data Factory (ADF)]
                              [Self-Hosted Integration Runtime / SHIR]
                                     [Incremental Watermark CDC]
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                           BRONZE LAYER (ADLS Gen2 - Raw Data Ingestion)                            |
|  - Storage: Azure Data Lake Storage Gen2 (Hierarchical Namespace)                                 |
|  - Format: Raw Apache Parquet / Append-only JSON with ingestion metadata timestamps                |
|  - Path: adls://lakehouse/bronze/atithya360/{table}/year={yyyy}/month={mm}/day={dd}/             |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                   [Azure Databricks / Apache Spark]
                                [Schema Enforcement & PII Tokenization]
                                [Deduplication, Cleaning, CDC Merge]
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                           SILVER LAYER (Delta Lake - Cleaned & Enriched)                          |
|  - Storage: Delta Lake with ACID transactions and Time Travel                                      |
|  - Data Cleansing: Standardized state/country codes, validated timestamps, sanitized addresses      |
|  - Security: PII masking (Hashing/tokenizing passport/DL numbers for non-security pipelines)        |
|  - Tables: delta_stays_enriched, delta_guests_cleaned, delta_properties_dim                       |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                      [PySpark Feature Pipelines]
                                [Dimensional Modeling & Aggregations]
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                           GOLD LAYER (Delta Lake / Star Schema Datamarts)                          |
|  - Tables:                                                                                         |
|      1. gold_guest_daily_velocity (Daily tourist inflow by district & state)                        |
|      2. gold_property_occupancy_summary (Bed utilization rate by category)                         |
|      3. gold_country_visitor_intelligence (International arrival trend & visa purpose)             |
|      4. gold_destination_footfall_matrix (Capacity thresholds & seasonal peaks)                    |
|      5. gold_foreigner_security_registry (Authorized compliance metrics)                           |
+----------------------------------------------------------------------------------------------------+
                                                  │
                          ┌───────────────────────┴───────────────────────┐
                          ▼                                               ▼
+----------------------------------------------------+   +------------------------------------+
|       MICROSOFT FABRIC & POWER BI DASHBOARDS       |   |   TOURISM PREDICTIVE ML ENGINES   |
|  - Executive Tourism Decision Support              |   |  - 30-Day Demand Forecasting       |
|  - Real-Time Heatmaps for District Magistrates     |   |  - Anomaly & Overcrowding Alerting |
+----------------------------------------------------+   +------------------------------------+
```

---

## 2. Key Components & Technology Stack

| Layer / Stage | Technology | Purpose & Responsibility |
| :--- | :--- | :--- |
| **Source OLTP** | MySQL 8.0+ / PDO | High-concurrency transactional processing for hotel front desks and police audits. |
| **Ingestion Engine** | Azure Data Factory (ADF) | Scheduled and trigger-based batch ingestion pipelines with high-throughput copy activities. |
| **Data Lake Storage** | Azure Data Lake Storage (ADLS Gen2) | Scalable, hierarchical, POSIX-compliant data lake with fine-grained RBAC access control. |
| **Compute & ETL** | Azure Databricks (Apache Spark 3.5+) | Distributed PySpark data transformation, data quality validation, and star-schema dimensional modeling. |
| **Storage Format** | Delta Lake (Parquet + Delta Log) | ACID transactions, unified batch & streaming, data versioning (time travel), and compaction (Z-Ordering). |
| **Serving & BI** | Microsoft Power BI / Fabric Lakehouse | Interactive executive reporting, geospatial GIS heatmaps, and state planning insights. |

---

## 3. Data Governance & Security Posture

1. **Role-Based Access Control (Azure Entra ID / RBAC):**
   - Access to raw Bronze storage is restricted solely to ADF Service Principals.
   - Tourism analytics teams access aggregated Gold tables only.
   - PII fields (mobile numbers, full residential addresses, identity references) are obfuscated using HMAC tokens in the Silver layer.
2. **Data Retention & Archival Policies:**
   - Raw Bronze JSON/Parquet: Retained for 365 days in ADLS Cool Tier.
   - Silver Cleansed Delta tables: Retained for 7 years for regulatory compliance.
   - Gold Aggregates: Permanent archival for multi-year historical trend analysis.
