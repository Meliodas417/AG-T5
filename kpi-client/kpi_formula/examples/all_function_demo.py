from kpi_formula.core.data_manager import DataManager
from kpi_formula.advanced.data_processor import DataProcessor
import pandas as pd
import os

def create_sample_data():
    """Create sample data file"""
    sales_data = {
        'date': ['2023-01-01', '2023-02-01', '2023-03-01'],
        'product_id': ['P001', 'P002', 'P003'],
        'sales_amount': [1000, 1200, 1500]
    }
    
    df = pd.DataFrame(sales_data)
    os.makedirs('example_data', exist_ok=True)
    df.to_csv('example_data/sales_data.csv', index=False)
    return 'example_data/sales_data.csv'

def demonstrate_data_processing():
    """Demonstrate data processing functionality"""
    file_path = create_sample_data()
    
    try:
        # Initialize data manager
        manager = DataManager()
        
        # Import data
        print("1. Importing data...")
        data_item = manager.import_csv(file_path)
        print(f"Data headers: {data_item.headers}")
        print(f"Total rows: {len(data_item.data)}")
        
        # Extract sales amount data for processing
        sales_amounts = [float(row[2]) for row in data_item.data]
        
        # Calculate moving average
        print("\n2. Calculating moving average...")
        ma = DataProcessor.moving_average(sales_amounts, window=2)
        print(f"Moving average results: {ma}")
        
        # Update cell example
        print("\n3. Updating cell...")
        manager.update_cell(row_index=0, col_index=2, value="1100")
        print("Updated first row sales amount")
        
        # Export updated data
        print("\n4. Exporting data...")
        output_path = 'example_data/updated_sales.csv'
        manager.export_csv(data_item, output_path)
        print(f"Exported to: {output_path}")
        
        print(f"\n5. History count: {len(manager.history)}")
        
    except Exception as e:
        print(f"Error during processing: {str(e)}")
    finally:
        # Clean up sample files
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists('example_data/updated_sales.csv'):
            os.remove('example_data/updated_sales.csv')
        try:
            os.rmdir('example_data')
        except:
            pass

def demonstrate_advanced_processing():
    """Demonstrate advanced data processing features"""
    sales_data = [100, 120, 150, 140, 160, 180, 200, 220, 240, 260, 280, 300,
                  110, 130, 160, 150, 170, 190, 210, 230, 250, 270, 290, 310]
    
    try:
        print("\n=== Advanced Data Processing Demo ===")
        
        # 1. Moving Average
        print("\n1. Moving Average Analysis")
        ma = DataProcessor.moving_average(sales_data, window=3)
        print(f"3-month moving average (first 5 results): {ma[:5]}")
        
        # 2. Year-over-Year Growth
        print("\n2. Year-over-Year Growth Analysis")
        yoy = DataProcessor.year_over_year_growth(sales_data)
        print(f"YoY growth rates (first 5 results): {[round(x, 2) for x in yoy[:5]]}%")
        
        # 3. Percentile Analysis
        print("\n3. Percentile Analysis")
        p75 = DataProcessor.calculate_percentile(sales_data, 75)
        print(f"75th percentile: {p75}")
        
    except Exception as e:
        print(f"Error in advanced processing: {str(e)}")

if __name__ == "__main__":
    print("=== Basic Data Processing Demo ===")
    demonstrate_data_processing()
    demonstrate_advanced_processing()