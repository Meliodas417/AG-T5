import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from kpi_formula.core.data_manager import DataManager
import pandas as pd

def create_sample_data():
    """Create sample data file"""
    sales_data = {
        'date': ['2023-01-01', '2023-02-01', '2023-03-01'],
        'product_id': ['P001', 'P002', 'P003'],
        'sales_amount': [1000, 1200, 1500]
    }
    
    df = pd.DataFrame(sales_data)
    df.to_csv('sales_data.csv', index=False)
    return 'sales_data.csv'

def test_update_functionality():
    """Test the update cell functionality"""
    file_path = create_sample_data()
    
    try:
        # Initialize manager
        manager = DataManager()
        
        # Import data
        print("1. Original data:")
        data_item = manager.import_csv(file_path)
        print("\nHeaders:", data_item.headers)
        print("Data:")
        for row in data_item.data:
            print(row)
        
        # Update cell
        print("\n2. Updating cell (row 0, column 2) to 2000...")
        manager.update_cell(row_index=0, col_index=2, value="2000")
        
        # Verify update
        print("\n3. Updated data:")
        print("Headers:", manager.current_data.headers)
        print("Data:")
        for row in manager.current_data.data:
            print(row)
        
        # Export updated data
        output_path = 'updated_sales.csv'
        manager.export_csv(manager.current_data, output_path)
        print(f"\n4. Updated data exported to: {output_path}")
        
        # Verify history
        print(f"\n5. History count: {len(manager.history)}")
        print("History operations:", [item.operation for item in manager.history])
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists('updated_sales.csv'):
            os.remove('updated_sales.csv')

if __name__ == "__main__":
    print("=== Testing Update Functionality ===\n")
    test_update_functionality()