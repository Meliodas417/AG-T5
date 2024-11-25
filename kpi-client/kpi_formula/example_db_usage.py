from kpi_formula import DataManager

# Initialize manager
manager = DataManager()

try:
    # Connect to SQLite database
    manager.connect_database("sqlite:///test_sales.db")
    
    # Load all base tables
    manager.load_from_table(
        table_name='sales_transactions',
        name='sales'
    )
    
    manager.load_from_table(
        table_name='products',
        name='products'
    )
    
    manager.load_from_table(
        table_name='customers',
        name='customers'
    )
    
    # Method 1: Using SQL JOIN (more efficient for large datasets)
    manager.load_from_query(
        """
        SELECT 
            s.date,
            s.product_id,
            p.product_name,
            s.sales_amount,
            s.quantity,
            c.customer_name,
            c.region
        FROM sales_transactions s
        JOIN products p ON s.product_id = p.product_id
        JOIN customers c ON s.customer_id = c.customer_id
        WHERE s.sales_amount > 2000
        """,
        name='detailed_sales_sql'
    )
    
    # Method 2: Using Python join_datasets (more flexible for in-memory operations)
    manager.join_datasets(
        left_name='sales',
        right_name='products',
        on='product_id',
        how='left',
        result_name='sales_with_products'
    )
    
    manager.join_datasets(
        left_name='sales_with_products',
        right_name='customers',
        on='customer_id',
        how='left',
        result_name='detailed_sales_python'
    )
    
    # Add calculated columns
    manager.add_column(
        data_name='sales',
        new_column='unit_price',
        expression='sales_amount / quantity'
    )
    
    # Calculate statistics
    total_sales = manager.compute(
        data_name='sales',
        columns=['sales_amount'],
        operation='sum'
    )
    
    # Format total sales with proper number formatting
    print(f"\nTotal sales: ${float(total_sales.iloc[0]):,.2f}")
    
    # Export results (both SQL and Python joined results)
    manager.export_data(
        'detailed_sales_sql',
        'sales_analysis_sql.xlsx',
        format='excel',
        sheet_name='SQL Join Results'
    )
    
    manager.export_data(
        'detailed_sales_python',
        'sales_analysis_python.xlsx',
        format='excel',
        sheet_name='Python Join Results'
    )
    
    # Save results back to database
    manager.save_to_database(
        data_name='detailed_sales_python',
        table_name='sales_analysis',
        if_exists='replace'
    )

    # Print some additional statistics
    print("\nSales Analysis:")
    print("-" * 40)
    
    # Calculate average sales
    avg_sales = manager.compute(
        data_name='sales',
        columns=['sales_amount'],
        operation='mean'
    )
    print(f"Average sale: ${float(avg_sales.iloc[0]):,.2f}")
    
    # Calculate total quantity
    total_qty = manager.compute(
        data_name='sales',
        columns=['quantity'],
        operation='sum'
    )
    print(f"Total quantity: {int(total_qty.iloc[0]):,}")
    
    # Calculate average unit price
    avg_unit_price = manager.compute(
        data_name='sales',
        columns=['unit_price'],
        operation='mean'
    )
    print(f"Average unit price: ${float(avg_unit_price.iloc[0]):,.2f}")

except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    print(f"\nFull error traceback:")
    print(traceback.format_exc())