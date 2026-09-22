# ATITHYA360 – Cloud Pipeline Design & Automation

## 1. Orchestration & Trigger Matrix

| Pipeline Name | Source | Destination | Frequency | Trigger Type | SLA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `adf_ingest_stays_cdc` | MySQL `stays` | ADLS Gen2 Bronze | Every 15 mins | Scheduled Tumbling Window | 5 mins |
| `adf_ingest_guests_cdc`| MySQL `guests`| ADLS Gen2 Bronze | Every 30 mins | Scheduled Tumbling Window | 5 mins |
| `adf_ingest_properties`| MySQL `properties`| ADLS Gen2 Bronze | Daily at 01:00 UTC | Schedule Trigger | 10 mins |
| `databricks_silver_transform` | ADLS Bronze | Delta Silver | On Bronze Arrival | Event-Based / Storage Event | 15 mins |
| `databricks_gold_marts` | Delta Silver | Delta Gold | Daily at 03:00 UTC | Pipeline Orchestration | 30 mins |
| `powerbi_dataset_refresh` | Delta Gold | Power BI Service | Daily at 04:00 UTC | REST API Trigger | 10 mins |

---

## 2. Failure Handling & Alerting Architecture
- **ADF Webhook Alerting:** Sends automated Teams/Slack notifications on pipeline error with failure Run ID and error message.
- **Dead-Letter Storage:** Malformed raw records fail into `adls://bronze/_quarantine/{table}/{date}/` with failure reason metadata.
- **Delta Table Optimization:** Automated daily jobs execute `OPTIMIZE` and `VACUUM RETAIN 168 HOURS` to maintain query performance.
