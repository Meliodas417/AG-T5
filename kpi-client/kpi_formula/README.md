
# KPI Formula Tool Usage Guide

## Table of Contents
1. [Installation](#1-installation)  
2. [Basic Usage](#2-basic-usage)  
3. [Data Loading](#3-data-loading)  
4. [Data Operations](#4-data-operations)  
5. [Table Operations](#5-table-operations)  
6. [Advanced KPI Calculations](#6-advanced-kpi-calculations)  
7. [Data Processing](#7-data-processing)  
8. [Data Export](#8-data-export)  
9. [Common Issues](#9-common-issues)  
10. [Best Practices](#10-best-practices)  

---

## 1. Installation

```bash
pip install kpi-formula-t5

# For development installation
pip install -e ".[dev]"

# For database support
pip install ".[mysql]"  # MySQL support
pip install ".[postgresql]"  # PostgreSQL support
```

---

## 2. Basic Usage

```python
from kpi_formula import DataManager

# Initialize manager
manager = DataManager()
```

---

## 3. Data Loading

### a) From Files
```python
# Load CSV
manager.load_data('sales.csv', 'sales')

# Load Excel
manager.load_data('customers.xlsx', 'customers')

# Load JSON
manager.load_data('products.json', 'products')
```

### b) From Database
```python
# Connect to database
manager.connect_database("sqlite:///test.db")  # SQLite
manager.connect_database("postgresql://user:password@localhost:5432/dbname")  # PostgreSQL
manager.connect_database("mysql+pymysql://user:password@localhost:3306/dbname")  # MySQL

# Load from table
manager.load_from_table(
    table_name='sales_transactions',
    name='sales'
)

# Load with SQL query
manager.load_from_query(
    """
    SELECT s.*, c.customer_name
    FROM sales_transactions s
    JOIN customers c ON s.customer_id = c.customer_id
    WHERE s.sales_amount > 1000
    """,
    name='filtered_sales'
)
```

---

## 4. Data Operations

### a) Add Calculated Columns
```python
manager.add_column(
    data_name='sales',
    new_column='unit_price',
    expression='sales_amount / quantity'
)
```

### b) Compute Operations
```python
# Sum
total = manager.compute(
    data_name='sales',
    columns=['sales_amount'],
    operation='sum'
)

# Average with grouping
avg_by_region = manager.compute(
    data_name='sales',
    columns=['sales_amount'],
    operation='mean',
    group_by='region'
)
```

**Supported operations:**  
- `'sum'`: Sum  
- `'mean'`: Average  
- `'median'`: Median  
- `'max'`: Maximum  
- `'min'`: Minimum  
- `'count'`: Count  

---

## 5. Table Operations

### a) Basic Join
```python
manager.join_datasets(
left_name='sales',
right_name='customers',
    on='customer_id', # if column names are the same
    # or
    # left_on='sales_customer_id', # if column names are different
    # right_on='customer_id',
    how='left',
    result_name='sales_with_customer'
)
```

**Join Types:**  
- `how='left'`: Left join  
- `how='right'`: Right join  
- `how='inner'`: Inner join  
- `how='outer'`: Outer join  

---

## 6. Advanced KPI Calculations

```python
from kpi_formula.advanced.kpi_calculator import KPICalculator

# ROI
roi = KPICalculator.roi(revenue=1000, investment=500)

# Conversion Rate
conv_rate = KPICalculator.conversion_rate(
    conversions=30,
    visitors=1000
)

# Customer Lifetime Value
clv = KPICalculator.customer_lifetime_value(
    avg_purchase_value=100,
    avg_purchase_frequency=4,
    customer_lifespan=3
)

# Gross Margin
margin = KPICalculator.gross_margin(
    revenue=1000,
    cost=600
)
```

---

## 7. Data Processing

```python
from kpi_formula.advanced.data_processor import DataProcessor

# Moving Average
ma = DataProcessor.moving_average(sales_data, window=3)

# Year-over-Year Growth
yoy = DataProcessor.year_over_year_growth(sales_data)
```

---

## 8. Data Export

### a) To Files
```python
# CSV Export
manager.export_data('sales', 'exports/sales.csv')

# Excel Export
manager.export_data(
    'sales',
    'exports/sales.xlsx',
    format='excel',
    sheet_name='Sales Data'
)

# JSON Export
manager.export_data(
    'sales',
    'exports/sales.json',
    format='json',
    orient='records'
)
```

### b) To Database
```python
manager.save_to_database(
    data_name='sales_analysis',
    table_name='analysis_results',
    if_exists='replace'  # 'fail', 'replace', or 'append'
)
```

---

## 9. Common Issues

### a) Import Errors
Make sure all required dependencies are installed:
```bash
pip install "kpi-formula-t5[all]"
```

### b) Database Connection Errors
- Check connection string format  
- Verify database credentials  
- Ensure database server is running  
- Install appropriate database drivers:  
  ```bash
  pip install "kpi-formula-t5[mysql]"  # for MySQL
  pip install "kpi-formula-t5[postgresql]"  # for PostgreSQL
  ```

### c) File Path Errors
```python
import os
file_path = os.path.join(os.getcwd(), 'data', 'sales.csv')
manager.load_data(file_path, 'sales')
```

---

## 10. Best Practices

1. Always use try-except blocks for error handling  
2. Validate data before processing  
3. Use meaningful names for datasets  
4. Close database connections when done  
5. Export results regularly  
6. Monitor memory usage with large datasets  
7. Use appropriate data types for calculations  

---

For more information and updates, visit:  
[GitHub Repository](https://github.com/Meliodas417/AG-T5)