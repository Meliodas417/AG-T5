
# KPI Formula Usage Guide

## Table of Contents
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Data Loading](#data-loading)
4. [Data Operations](#data-operations)
5. [Table Operations](#table-operations)
6. [Data Export](#data-export)
7. [Complete Examples](#complete-examples)
8. [Common Issues](#common-issues)

---

## 1. Installation
```bash
pip install kpi-formula-t5
pip install pandas numpy openpyxl
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

### a) Load from CSV
```python
# Load single CSV file
manager.load_data('sales_data.csv', 'sales')
```
**Example CSV format:**
```csv
date,product_id,customer_id,sales_amount,quantity
2023-01-01,P001,C1,1000,5
2023-01-02,P002,C2,1200,3
```

### b) Load from DataFrame
```python
import pandas as pd

df = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
})
manager.load_data(df, 'my_data')
```

---

## 4. Data Operations

### a) Add Calculated Column
```python
# Basic calculation
manager.add_column(
    data_name='sales',
    new_column='unit_price',
    expression='sales_amount / quantity'
)

# Calculation with condition
manager.add_column(
    data_name='sales',
    new_column='total_with_tax',
    expression='sales_amount * 1.1'  # 10% tax
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

# Average
average = manager.compute(
    data_name='sales',
    columns=['unit_price'],
    operation='mean'
)
```

**Supported operations:**
- `'sum'`: Sum
- `'mean'`: Average
- `'max'`: Maximum
- `'min'`: Minimum
- `'count'`: Count

---

## 5. Table Operations

### a) Basic Join
```python
# Load two datasets
manager.load_data('sales_data.csv', 'sales')
manager.load_data('customer_data.csv', 'customers')

# Join operation
manager.join(
    left_name='sales',
    right_name='customers',
    left_on='customer_id',
    right_on='customer_id',
    how='left',
    result_name='sales_with_customer'
)
```

### b) Multi-Column Join
```python
manager.join(
    left_name='sales',
    right_name='customers',
    left_on=['customer_id', 'region'],
    right_on=['id', 'region'],
    how='inner',
    result_name='matched_sales'
)
```

**Join Types:**
- `how='left'`: Left join
- `how='right'`: Right join
- `how='inner'`: Inner join
- `how='outer'`: Outer join

---

## 6. Data Export

### a) CSV Export
```python
manager.export_data('sales', 'exports/sales.csv')
```

### b) Excel Export
```python
manager.export_data(
    'sales',
    'exports/sales.xlsx',
    format='excel',
    sheet_name='Sales Data'
)
```

### c) JSON Export
```python
manager.export_data(
    'sales',
    'exports/sales.json',
    format='json',
    orient='records'
)
```

### d) Summary Export
```python
manager.export_summary('sales', 'exports/sales_summary.json')
```

---

## 7. Complete Examples
```python
from kpi_formula import DataManager

# Initialize
manager = DataManager()

try:
    # 1. Load data
    manager.load_data('sales_data.csv', 'sales')
    manager.load_data('customer_data.csv', 'customers')

    # 2. Add calculated column
    manager.add_column(
        data_name='sales',
        new_column='unit_price',
        expression='sales_amount / quantity'
    )

    # 3. Join data
    manager.join(
        left_name='sales',
        right_name='customers',
        left_on='customer_id',
        right_on='customer_id',
        how='left',
        result_name='full_data'
    )

    # 4. Compute statistics
    total_sales = manager.compute(
        data_name='full_data',
        columns=['sales_amount'],
        operation='sum'
    )
    print(f"Total sales: {total_sales}")

    # 5. Export results
    manager.export_data(
        'full_data',
        'exports/analysis_results.xlsx',
        format='excel',
        sheet_name='Sales Analysis'
    )

except Exception as e:
    print(f"Error: {str(e)}")
```

---

## 8. Common Issues

### a) Import Errors
Make sure all required dependencies are installed:
```bash
pip install pandas numpy openpyxl
```

### b) File Path Errors
Use absolute paths or ensure relative paths are correct:
```python
import os
file_path = os.path.join(os.getcwd(), 'data', 'sales.csv')
manager.load_data(file_path, 'sales')
```

### c) Memory Issues
For large datasets, consider batch processing or sampling:
```python
# Read first 1000 rows
import pandas as pd
df = pd.read_csv('large_file.csv', nrows=1000)
manager.load_data(df, 'sample_data')
```

### d) Data Type Errors
Ensure correct data types:
```python
# Convert data types before loading
df['sales_amount'] = pd.to_numeric(df['sales_amount'], errors='coerce')
```

---

For more information and updates, please visit our [GitHub repository](https://github.com/Meliodas417/AG-T5).
```

