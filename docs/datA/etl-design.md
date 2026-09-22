# ATITHYA360 – ETL & Ingestion Design Specification

## 1. Incremental Ingestion Strategy (Watermark CDC)

To extract changes from MySQL 8+ without stressing the production OLTP database during active hotel check-in hours, Azure Data Factory utilizes **High-Watermark Incremental Ingestion** via ADF Copy Activities.

### Watermark Control Table (MySQL / Metastore)
```sql
CREATE TABLE `etl_watermark_control` (
    `table_name` VARCHAR(100) PRIMARY KEY,
    `watermark_column` VARCHAR(100) NOT NULL,
    `last_watermark_value` DATETIME NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `etl_watermark_control` VALUES
('properties', 'updated_at', '2026-01-01 00:00:00', NOW()),
('guests', 'updated_at', '2026-01-01 00:00:00', NOW()),
('stays', 'updated_at', '2026-01-01 00:00:00', NOW()),
('alerts', 'created_at', '2026-01-01 00:00:00', NOW()),
('audit_logs', 'created_at', '2026-01-01 00:00:00', NOW());
```

### ADF Incremental Pipeline Flow
1. **Lookup Activity (Current Watermark):** Reads `last_watermark_value` for `stays`.
2. **Lookup Activity (Max Source Watermark):** Queries MySQL `SELECT MAX(updated_at) AS NewWatermark FROM stays;`.
3. **Copy Activity:** Executes parameterized SQL query against MySQL source:
   ```sql
   SELECT * FROM stays
   WHERE updated_at > '@{activity('GetLastWatermark').output.firstRow.last_watermark_value}'
     AND updated_at <= '@{activity('GetNewWatermark').output.firstRow.NewWatermark}';
   ```
4. **Sink Target:** Writes incremental dataset as snappy-compressed Parquet into ADLS Gen2 Bronze directory `adls://bronze/stays/incremental_@{pipeline().RunId}.parquet`.
5. **Stored Procedure / Update Control:** Updates `last_watermark_value` with `NewWatermark`.
6. **Trigger Databricks Notebook:** Automatically triggers Bronze-to-Silver PySpark Merge job.

---

## 2. Silver Layer PySpark Merge Script (Idempotent Upsert)

```python
# Databricks PySpark Silver Upsert Job for Stays
from pyspark.sql.functions import col, current_timestamp
from delta.tables import DeltaTable

# 1. Read incremental batch from Bronze
bronze_df = spark.read.parquet("abfss://bronze@atithyasa.dfs.core.windows.net/stays/incremental_*.parquet")

# 2. Data Cleaning & Transformation
cleaned_df = bronze_df.filter(col("stay_code").isNotNull()) \
    .withColumn("ingested_at", current_timestamp())

# 3. Delta Merge (Upsert)
silver_table = DeltaTable.forPath(spark, "abfss://silver@atithyasa.dfs.core.windows.net/delta_stays")

silver_table.alias("target").merge(
    cleaned_df.alias("source"),
    "target.id = source.id"
).whenMatchedUpdateAll() \
 .whenNotMatchedInsertAll() \
 .execute()

print("Silver Stays Delta Merge successfully executed.")
```
