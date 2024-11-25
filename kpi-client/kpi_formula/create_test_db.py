import sqlite3
import pandas as pd
from datetime import datetime, timedelta

# Create test data
def create_test_data():
    # Sales data
    dates = [(datetime.now() - timedelta(days=x)).strftime('%Y-%m-%d') for x in range(30)]
    sales_data = {
        'date': dates,
        'product_id': [f'P{i:03d}' for i in range(1, 31)],
        'customer_id': [f'C{i:03d}' for i in range(1, 31)],
        'sales_amount': [1000 + i * 100 for i in range(30)],
        'quantity': [5 + i for i in range(30)]
    }
    
    # Products data
    products_data = {
        'product_id': [f'P{i:03d}' for i in range(1, 31)],
        'product_name': [f'Product {i}' for i in range(1, 31)],
        'category': ['Electronics'] * 10 + ['Clothing'] * 10 + ['Books'] * 10,
        'unit_price': [100 + i * 10 for i in range(30)]
    }
    
    # Customers data
    customers_data = {
        'customer_id': [f'C{i:03d}' for i in range(1, 31)],
        'customer_name': [f'Customer {i}' for i in range(1, 31)],
        'region': ['North'] * 10 + ['South'] * 10 + ['East'] * 10
    }
    
    return pd.DataFrame(sales_data), pd.DataFrame(products_data), pd.DataFrame(customers_data)

# Create database and tables
def create_database():
    # Create database connection
    conn = sqlite3.connect('test_sales.db')
    
    # Get test data
    sales_df, products_df, customers_df = create_test_data()
    
    # Save to database
    sales_df.to_sql('sales_transactions', conn, index=False, if_exists='replace')
    products_df.to_sql('products', conn, index=False, if_exists='replace')
    customers_df.to_sql('customers', conn, index=False, if_exists='replace')
    
    print("Database created successfully!")
    print(f"Sales records: {len(sales_df)}")
    print(f"Products: {len(products_df)}")
    print(f"Customers: {len(customers_df)}")
    
    conn.close()

if __name__ == "__main__":
    create_database() 