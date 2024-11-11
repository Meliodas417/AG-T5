
# KPI Formula

A Python package for KPI (Key Performance Indicator) calculations and data processing.

## Installation

You can install the package using pip:

bash
pip install kpi-formula-t5

## Table of Contents
1. [Data Management (DataManager)](#data-management-datamanager)
2. [Data Processing (DataProcessor)](#data-processing-dataprocessor)
3. [Data Validation (DataValidator)](#data-validation-datavalidator)
4. [KPI Calculations (KPICalculator)](#kpi-calculations-kpicalculator)
5. [Time Series Analysis (TimeSeriesAnalyzer)](#time-series-analysis-timeseriesanalyzer)
6. [Complete Example](#complete-example)
7. [Notes](#notes)
8. [Requirements](#requirements)

---

### 1. Data Management (DataManager)

```python
# Import required modules
from kpi_formula.core.data_manager import DataManager

# Initialize DataManager
manager = DataManager()

# Import CSV
data_item = manager.import_csv('sales_data.csv')
print(f"Headers: {data_item.headers}")
print(f"Total rows: {len(data_item.data)}")

# Update a cell (row_index and col_index start from 0)
manager.update_cell(row_index=0, col_index=2, value="2000")

# Export to CSV
manager.export_csv(data_item, 'output.csv')
```

---

### 2. Data Processing (DataProcessor)

```python
# Import required modules
from kpi_formula.advanced.data_processor import DataProcessor

# Sample data
sales_data = [1000, 1200, 1500, 1300, 1600]

# Moving Average
ma = DataProcessor.moving_average(sales_data, window=3)
print("Moving average:", ma)  # [1233.33, 1333.33, 1466.67]

# Year-over-Year Growth
yoy = DataProcessor.year_over_year_growth(sales_data)
print("YoY growth (%):", yoy)  # [10.0, 8.33, 6.67, 7.14]

# Percentile Calculation
p75 = DataProcessor.calculate_percentile(sales_data, 75)
print("75th percentile:", p75)  # 1500.0
```

---

### 3. Data Validation (DataValidator)

```python
# Import required modules
from kpi_formula.advanced.data_validator import DataValidator

# Validate Numeric Data
data = [100, 200, 'invalid', 300]
cleaned_data, errors = DataValidator.validate_numeric(data)
print("Cleaned data:", cleaned_data)  # [100, 200, 300]
print("Errors:", errors)  # {'2': 'invalid'}

# Validate Date Format
is_valid = DataValidator.validate_date_format('2024-03-20')
print("Is valid date:", is_valid)  # True
```

---

### 4. KPI Calculations (KPICalculator)

```python
# Import required modules
from kpi_formula.advanced.kpi_calculator import KPICalculator

# Return on Investment (ROI)
roi = KPICalculator.roi(revenue=1000, investment=500)
print("ROI (%):", roi)  # 100.0

# Conversion Rate
conv_rate = KPICalculator.conversion_rate(conversions=30, visitors=1000)
print("Conversion Rate (%):", conv_rate)  # 3.0

# Customer Lifetime Value (CLV)
clv = KPICalculator.customer_lifetime_value(
    avg_purchase_value=100,
    avg_purchase_frequency=4,
    customer_lifespan=3
)
print("CLV:", clv)  # 1200.0

# Gross Margin
margin = KPICalculator.gross_margin(revenue=1000, cost=600)
print("Gross Margin (%):", margin)  # 40.0
```

---

### 5. Time Series Analysis (TimeSeriesAnalyzer)

```python
# Import required modules
from kpi_formula.advanced.time_series import TimeSeriesAnalyzer

# Sample Time Series Data
data = [100, 120, 150, 140, 160, 180, 200, 220, 240, 260, 280, 300]

# Seasonality Analysis
seasonal = TimeSeriesAnalyzer.seasonality(data, period=4)
print("Seasonal components:", seasonal['seasonal'])
print("Trend components:", seasonal['trend'])

# Simple Forecast
forecast = TimeSeriesAnalyzer.forecast_simple(data, periods=3)
print("Forecast next 3 periods:", forecast)

# Trend Detection
trend = TimeSeriesAnalyzer.detect_trend(data)
print("Trend direction:", trend)  # 'upward', 'downward', or 'neutral'
```

---

### Complete Example

```python
# Import all required modules
from kpi_formula.core.data_manager import DataManager
from kpi_formula.advanced.data_processor import DataProcessor
import pandas as pd

# Create sample data and save to CSV
sales_data = {
    'date': ['2023-01-01', '2023-02-01', '2023-03-01'],
    'product_id': ['P001', 'P002', 'P003'],
    'sales_amount': [1000, 1200, 1500]
}
df = pd.DataFrame(sales_data)
df.to_csv('sales_data.csv', index=False)

# Initialize DataManager
manager = DataManager()

# Import and Process Data
data_item = manager.import_csv('sales_data.csv')
sales_amounts = [float(row[2]) for row in data_item.data]

# Calculate Moving Average
ma = DataProcessor.moving_average(sales_amounts, window=2)
print("Moving average:", ma)

# Update data and export
manager.update_cell(row_index=0, col_index=2, value="2000")
manager.export_csv(data_item, 'updated_sales.csv')
```

---

### Notes
- All numeric calculations return float values.
- Date formats should be in `YYYY-MM-DD`.
- CSV files should have headers.
- Index values start from 0.
- Exception handling is recommended in production code.

---

### Requirements
- Python >= 3.6
- pandas >= 1.0.0
- numpy >= 1.18.0