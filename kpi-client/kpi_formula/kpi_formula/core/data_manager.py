import pandas as pd
from pathlib import Path
from typing import List, Optional
from datetime import datetime
from .models import HistoryItem

class DataManager:
    def __init__(self):
        self.history: List[HistoryItem] = []
        self.current_data: Optional[HistoryItem] = None

    def import_csv(self, file_path: str) -> HistoryItem:
        """Import data from CSV file"""
        try:
            df = pd.read_csv(file_path)
            
            item = HistoryItem(
                operation='import',
                inputs=[file_path],
                result=df.values.tolist(),
                headers=df.columns.tolist(),
                data=df.values.tolist()
            )
            
            self.history.append(item)
            self.current_data = item
            return item
            
        except Exception as e:
            raise ImportError(f"Failed to import CSV file: {str(e)}")

    def export_csv(self, item: HistoryItem, file_path: str) -> None:
        """Export data to CSV file"""
        try:
            df = pd.DataFrame(item.data, columns=item.headers)
            df.to_csv(file_path, index=False)
        except Exception as e:
            raise ExportError(f"Failed to export CSV file: {str(e)}")

    def update_cell(self, row_index: int, col_index: int, value: str) -> None:
        """Update a single cell in the current data"""
        if not self.current_data:
            raise ValueError("No current data selected")

        try:
            # Create a deep copy of the current data
            new_data = [row.copy() for row in self.current_data.data]
            new_data[row_index][col_index] = value
            
            # Create new history item with updated data
            updated_item = HistoryItem(
                operation='update',
                inputs=[{'row': row_index, 'col': col_index, 'value': value}],
                result=new_data,
                headers=self.current_data.headers,
                data=new_data
            )
            
            # Update current data and history
            self.current_data = updated_item
            self.history.append(updated_item)
            
        except Exception as e:
            raise UpdateError(f"Failed to update cell: {str(e)}")

    def get_item_by_index(self, index: int) -> Optional[HistoryItem]:
        """Get history item by index"""
        try:
            return self.history[index]
        except IndexError:
            return None

class ImportError(Exception):
    pass

class ExportError(Exception):
    pass

class UpdateError(Exception):
    pass
