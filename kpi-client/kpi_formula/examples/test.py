import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from kpi_formula import DataManager

# Create sample data
sales_data = "sales_data.csv"
customer_data = "customer_data.csv"

# Initialize manager
manager = DataManager()

# Load both datasets
manager.load_data(sales_data, 'sales')
manager.load_data(customer_data, 'customers')

# Add calculated column (unit price)
manager.add_column(
    data_name='sales',
    new_column='unit_price',
    expression='sales_amount / quantity'
)

# Perform some calculations
total_sales = manager.compute(
    data_name='sales',
    columns=['sales_amount'],
    operation='sum'
)
print(f"Total sales: {total_sales}")

# Join datasets
manager.join(
    left_name='sales',
    right_name='customers',
    left_on='customer_id',
    right_on='customer_id',
    how='left',
    result_name='sales_with_customer'
)

# Export to different formats
manager.export_data('sales', 'exports/sales_output.csv')
manager.export_data('sales', 'exports/sales_output.xlsx', format='excel', sheet_name='Sales Data')
manager.export_data('sales', 'exports/sales_output.json', format='json', orient='records')

# Export with specific options for CSV
manager.export_data('sales', 'exports/sales_custom.csv',
                   sep=';',  # Use semicolon as separator
                   encoding='utf-8',  # Specify encoding
                   date_format='%Y-%m-%d')  # Format dates

# Export data summary
manager.export_summary('sales', 'exports/sales_summary.json')