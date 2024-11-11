import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from kpi_formula.core.data_manager import DataManager
from kpi_formula.advanced.data_processor import DataProcessor
import pandas as pd

def demonstrate_data_processing(file_path: str):
    """Demonstrate data processing functionality
    
    Args:
        file_path (str): Path to your CSV file
    """
    try:
        # Initialize data manager
        manager = DataManager()
        
        # Import data
        print("\n1. Importing data...")
        data_item = manager.import_csv(file_path)
        print(f"Data headers: {data_item.headers}")
        print(f"Total rows: {len(data_item.data)}")
        
        # Display first few rows
        print("\nFirst 3 rows of data:")
        for row in data_item.data[:3]:
            print(row)
        
        # Process numeric column (assuming it's the third column)
        print("\n2. Processing numeric data...")
        numeric_column = input("Enter the column number to analyze (0-based index): ")
        try:
            col_index = int(numeric_column)
            values = [float(row[col_index]) for row in data_item.data]
            
            # Calculate moving average
            window = int(input("Enter window size for moving average (e.g., 3): "))
            ma = DataProcessor.moving_average(values, window=window)
            print(f"\nMoving average results (first 5):")
            print([round(x, 2) for x in ma[:5]])
            
            # Calculate year-over-year growth if enough data
            if len(values) >= 13:
                yoy = DataProcessor.year_over_year_growth(values)
                print(f"\nYear-over-Year growth rates (first 5):")
                print([f"{round(x, 2)}%" for x in yoy[:5]])
            
            # Calculate percentile
            p75 = DataProcessor.calculate_percentile(values, 75)
            print(f"\n75th percentile: {round(p75, 2)}")
            
        except ValueError as e:
            print(f"Error processing numeric data: {str(e)}")
            return
        
        # Update data
        should_update = input("\nDo you want to update any cell? (yes/no): ").lower()
        if should_update == 'yes':
            row_idx = int(input("Enter row index: "))
            col_idx = int(input("Enter column index: "))
            new_value = input("Enter new value: ")
            
            manager.update_cell(row_index=row_idx, col_index=col_idx, value=new_value)
            print("Cell updated successfully")
        
        # Export updated data
        should_export = input("\nDo you want to export the data? (yes/no): ").lower()
        if should_export == 'yes':
            output_path = input("Enter output file path (e.g., output.csv): ")
            manager.export_csv(data_item, output_path)
            print(f"Data exported to: {output_path}")
        
        print(f"\nHistory count: {len(manager.history)}")
        
    except Exception as e:
        print(f"Error during processing: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")

def main():
    print("=== Data Analysis Demo ===")
    
    # Get input file path
    while True:
        file_path = input("\nEnter the path to your CSV file: ")
        if os.path.exists(file_path) and file_path.endswith('.csv'):
            break
        print("File not found or not a CSV file. Please try again.")
    
    # Run demonstration
    demonstrate_data_processing(file_path)

if __name__ == "__main__":
    main() 