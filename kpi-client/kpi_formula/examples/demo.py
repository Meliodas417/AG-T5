import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from kpi_formula.core.data_manager import DataManager
import pandas as pd

def main():
    # Create sample CSV file
    df = pd.DataFrame({
        'A': [1, 2, 3],
        'B': [4, 5, 6]
    })
    
    # Ensure file path is correct
    csv_path = 'data/sample.csv'
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    # Save CSV file
    df.to_csv(csv_path, index=False)
    
    try:
        # Initialize data manager
        manager = DataManager()
        
        # Import CSV
        item = manager.import_csv(csv_path)
        
        # Print imported data
        print("=== Imported Data ===")
        print(f"ID: {item.id}")
        print(f"Name: {item.name}")
        print(f"Timestamp: {item.timestamp}")
        print(f"Type: {item.type}")
        print(f"Headers: {item.headers}")
        print("Data:")
        for row in item.data:
            print(row)
    finally:
        # Clean up temporary file
        if os.path.exists(csv_path):
            os.remove(csv_path)

if __name__ == "__main__":
    main()
