# ATITHYA360 – Dimensional Modeling & Star Schema

## 1. Dimensional Model Overview (Tourism Intelligence Mart)

The Gold Analytics layer models tourism patterns as a high-performance **Star Schema** optimized for analytical queries (OLAP) in Power BI, Fabric, and Azure Synapse.

```
                           +------------------------+
                           |     dim_property       |
                           +------------------------+
                           | property_key (PK)      |
                           | property_code          |
                           | property_name          |
                           | property_type          |
                           | room_capacity          |
                           | district_name          |
                           | state_name             |
                           +------------------------+
                                       │
                                       │ 1
                                       │
                                       │ *
+----------------------+   +----------------------------+   +----------------------+
|       dim_date       |   |       fact_stay_daily      |   |       dim_guest      |
+----------------------+   +----------------------------+   +----------------------+
| date_key (PK)        |1  | stay_key (PK)              |  *| guest_key (PK)       |
| full_date            |───| date_key (FK)              |───| guest_code           |
| day_of_week          | * | property_key (FK)          | 1 | guest_type           |
| month_number         |   | guest_key (FK)             |   | nationality          |
| month_name           |   | destination_key (FK)       |   | origin_country       |
| quarter              |   | guest_count                |   | origin_state         |
| year                 |   | length_of_stay_days        |   | purpose_of_visit     |
| is_weekend           |   | estimated_daily_spend_inr  |   +----------------------+
| is_holiday           |   | occupancy_ratio            |
+----------------------+   +----------------------------+
                                       │ *
                                       │
                                       │ 1
                           +------------------------+
                           |    dim_destination     |
                           +------------------------+
                           | destination_key (PK)   |
                           | destination_name       |
                           | category               |
                           | district_name          |
                           | annual_capacity        |
                           +------------------------+
```

---

## 2. Gold Aggregate Tables

### 1. `gold_guest_daily_velocity`
Aggregates daily tourist volume, average stay duration, and nationality breakdown across districts and states.
- Partitioned by: `year`, `month`, `state_name`

### 2. `gold_property_occupancy_summary`
Tracks room utilization percentages, property category performance (Homestays vs Hotels vs Resorts), and compliance ratios.

### 3. `gold_country_visitor_intelligence`
Measures foreign arrival volumes, seasonality shifts, and visa distribution for state tourism departments.

### 4. `gold_destination_footfall_matrix`
Provides capacity utilization vs footfall saturation metrics for major tourist attractions.
