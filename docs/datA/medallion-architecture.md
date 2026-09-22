# ATITHYA360 – Medallion Architecture Specification

## 1. Medallion Layer Responsibilities

```
+----------------------------------------------------------------------------------------------------+
| BRONZE LAYER: Raw Data Ingestion                                                                  |
| - Exact append-only copies of source MySQL tables.                                                 |
| - Retains full historical change records with extraction metadata (`_extracted_at`, `_source_file`)|
| - Schema on read, partitioned by extraction date.                                                  |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| SILVER LAYER: Cleansed, Standardized & Conformed                                                   |
| - Deduplicated and unified using Delta Lake ACID merge.                                            |
| - Standardized text encodings, normalized date/timestamp formats.                                  |
| - Data Quality constraints enforced via Great Expectations / Delta Constraints.                    |
| - Sensitive PII (Passport, Driving License) pseudonymized using salted cryptographic hashes.       |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| GOLD LAYER: Curated Business-Level Datamarts                                                       |
| - Star schema fact & dimension models.                                                             |
| - Pre-computed KPIs: Daily guest velocity, occupancy rates, foreign tourist origin trends.         |
| - Optimized for sub-second DirectQuery in Power BI via Delta Z-Ordering on (`state_id`, `date_key`)|
+----------------------------------------------------------------------------------------------------+
```

---

## 2. PySpark Gold Mart Aggregation Example

```python
# Databricks PySpark Gold Inflow Aggregation
from pyspark.sql.functions import count, sum, avg, col, datediff

silver_stays = spark.read.table("silver.delta_stays")
silver_guests = spark.read.table("silver.delta_guests")
silver_properties = spark.read.table("silver.delta_properties")

# Join & Aggregate
gold_daily = silver_stays.join(silver_guests, silver_stays.guest_id == silver_guests.id) \
    .join(silver_properties, silver_stays.property_id == silver_properties.id) \
    .groupBy("checkin_date", "state_name", "district_name", "guest_type", "nationality") \
    .agg(
        count("stay_code").alias("total_checkins"),
        sum("num_guests").alias("total_visitors"),
        avg(datediff("expected_checkout", "checkin_time")).alias("avg_planned_stay_days")
    )

gold_daily.write.format("delta") \
    .mode("overwrite") \
    .partitionBy("state_name") \
    .saveAsTable("gold.gold_guest_daily_velocity")

print("Gold daily visitor velocity mart successfully updated.")
```
