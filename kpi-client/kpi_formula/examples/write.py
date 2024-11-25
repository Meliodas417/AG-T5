import os

# 创建 docs 目录（如果不存在）
docs_dir = os.path.join('kpi_formula', 'docs')
os.makedirs(docs_dir, exist_ok=True)

# 使用指南内容
usage_guide = '''KPI Formula Usage Guide
======================

Table of Contents
----------------
1. Installation
2. Basic Usage
3. Data Loading
4. Data Operations
5. Table Operations
6. Data Export
7. Complete Examples
8. Common Issues

1. Installation
--------------
pip install kpi-formula-t5
pip install pandas numpy openpyxl

2. Basic Usage
-------------
from kpi_formula import DataManager

# Initialize manager
manager = DataManager()

3. Data Loading
--------------

a) Load from CSV:
# Load single CSV file
manager.load_data('sales_data.csv', 'sales')

# Example CSV format:
"""
date,product_id,customer_id,sales_amount,quantity
2023-01-01,P001,C1,1000,5
2023-01-02,P002,C2,1200,3
"""

b) Load from DataFrame:
import pandas as pd

df = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
})
manager.load_data(df, 'my_data')

4. Data Operations
-----------------

a) Add Calculated Column:
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

b) Compute Operations:
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

# Supported operations:
# - 'sum': Sum
# - 'mean': Average
# - 'max': Maximum
# - 'min': Minimum
# - 'count': Count

5. Table Operations
------------------

a) Basic Join:
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

b) Multi-Column Join:
manager.join(
    left_name='sales',
    right_name='customers',
    left_on=['customer_id', 'region'],
    right_on=['id', 'region'],
    how='inner',
    result_name='matched_sales'
)

Join Types:
- how='left': Left join
- how='right': Right join
- how='inner': Inner join
- how='outer': Outer join

6. Data Export
-------------

a) CSV Export:
manager.export_data('sales', 'exports/sales.csv')

b) Excel Export:
manager.export_data(
    'sales',
    'exports/sales.xlsx',
    format='excel',
    sheet_name='Sales Data'
)

c) JSON Export:
manager.export_data(
    'sales',
    'exports/sales.json',
    format='json',
    orient='records'
)

d) Summary Export:
manager.export_summary('sales', 'exports/sales_summary.json')

7. Complete Example
------------------
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

8. Common Issues
---------------

a) Import Errors:
Make sure all required dependencies are installed:
pip install pandas numpy openpyxl

b) File Path Errors:
Use absolute paths or ensure relative paths are correct:
import os
file_path = os.path.join(os.getcwd(), 'data', 'sales.csv')
manager.load_data(file_path, 'sales')

c) Memory Issues:
For large datasets, consider batch processing or sampling:
# Read first 1000 rows
import pandas as pd
df = pd.read_csv('large_file.csv', nrows=1000)
manager.load_data(df, 'sample_data')

d) Data Type Errors:
Ensure correct data types:
# Convert data types before loading
df['sales_amount'] = pd.to_numeric(df['sales_amount'], errors='coerce')

For more information and updates, please visit our GitHub repository.
'''

# 写入文件
with open(os.path.join(docs_dir, 'USAGE.txt'), 'w') as f:
    f.write(usage_guide)

print("Usage guide has been created at: kpi_formula/docs/USAGE.txt")