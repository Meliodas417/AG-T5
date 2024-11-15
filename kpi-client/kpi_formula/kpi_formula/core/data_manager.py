import pandas as pd
import numpy as np
from typing import List, Dict, Union, Any
from pathlib import Path

class DataManager:
    def __init__(self):
        self.dataframes = {}  # Store all dataframes
        self.history = []     # 添加历史记录列表
        self.current_data = None  # 添加当前数据属性
        
    def load_data(self, data: Union[str, pd.DataFrame], name: str) -> None:
        """
        Entry function for loading data
        
        Args:
            data: CSV file path or pandas DataFrame
            name: Name of the dataset
        """
        try:
            if isinstance(data, str):
                # If it's a file path, try to read CSV
                df = pd.read_csv(data)
            elif isinstance(data, pd.DataFrame):
                # If it's already a DataFrame, use it directly
                df = data
            else:
                raise ValueError("Unsupported data format. Please provide a CSV file path or pandas DataFrame")
            
            self.dataframes[name] = df
            print(f"Successfully loaded dataset '{name}'")
            print(f"Columns: {df.columns.tolist()}")
            print(f"Rows: {len(df)}")
            
        except Exception as e:
            raise ImportError(f"Failed to load data: {str(e)}")

    def add_column(self, 
                  data_name: str, 
                  new_column: str, 
                  expression: str) -> None:
        """
        Add a new calculated column
        
        Args:
            data_name: Dataset name
            new_column: New column name
            expression: Calculation expression (using existing column names)
        """
        try:
            df = self.dataframes[data_name]
            df[new_column] = df.eval(expression)
            print(f"Successfully added column '{new_column}'")
            
        except KeyError:
            raise KeyError(f"Dataset '{data_name}' not found")
        except Exception as e:
            raise ValueError(f"Failed to add column: {str(e)}")

    def compute(self, 
               data_name: str, 
               columns: List[str], 
               operation: str) -> Any:
        """
        Perform computation operations
        
        Args:
            data_name: Dataset name
            columns: Columns to compute
            operation: Operation type ('sum', 'mean', 'max', 'min', 'count')
        """
        try:
            df = self.dataframes[data_name]
            
            if operation == 'sum':
                result = df[columns].sum()
            elif operation == 'mean':
                result = df[columns].mean()
            elif operation == 'max':
                result = df[columns].max()
            elif operation == 'min':
                result = df[columns].min()
            elif operation == 'count':
                result = df[columns].count()
            else:
                raise ValueError(f"Unsupported operation type: {operation}")
                
            return result
            
        except KeyError:
            raise KeyError(f"Dataset '{data_name}' not found")
        except Exception as e:
            raise ValueError(f"Computation failed: {str(e)}")

    def join(self,
            left_name: str,
            right_name: str,
            left_on: Union[str, List[str]],
            right_on: Union[str, List[str]],
            how: str = 'inner',
            result_name: str = None) -> None:
        """
        Join two datasets
        
        Args:
            left_name: Left dataset name
            right_name: Right dataset name
            left_on: Left join key
            right_on: Right join key
            how: Join type ('inner', 'left', 'right', 'outer')
            result_name: Result dataset name
        """
        try:
            left_df = self.dataframes[left_name]
            right_df = self.dataframes[right_name]
            
            result = pd.merge(
                left_df,
                right_df,
                left_on=left_on,
                right_on=right_on,
                how=how
            )
            
            # Use default name if result_name not specified
            if result_name is None:
                result_name = f"{left_name}_{right_name}_joined"
                
            self.dataframes[result_name] = result
            print(f"Successfully created joined result '{result_name}'")
            print(f"Result columns: {result.columns.tolist()}")
            print(f"Result rows: {len(result)}")
            
        except KeyError as e:
            raise KeyError(f"Dataset not found: {str(e)}")
        except Exception as e:
            raise ValueError(f"Join operation failed: {str(e)}")

    def export_data(self,
                   data_name: str,
                   file_path: str,
                   format: str = 'csv',
                   **kwargs) -> None:
        """
        Export data to various formats
        
        Args:
            data_name: Name of the dataset to export
            file_path: Path to save the file
            format: Export format ('csv', 'excel', 'json', 'parquet')
            **kwargs: Additional export options
        
        Examples:
            manager.export_data('sales', 'output.csv')
            manager.export_data('sales', 'output.xlsx', format='excel', sheet_name='Sales')
            manager.export_data('sales', 'output.json', format='json', orient='records')
        """
        try:
            if data_name not in self.dataframes:
                raise KeyError(f"Dataset '{data_name}' not found")
                
            df = self.dataframes[data_name]
            
            # Create directory if it doesn't exist
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            
            if format.lower() == 'csv':
                df.to_csv(file_path, index=False, **kwargs)
            elif format.lower() == 'excel':
                df.to_excel(file_path, index=False, **kwargs)
            elif format.lower() == 'json':
                df.to_json(file_path, **kwargs)
            elif format.lower() == 'parquet':
                df.to_parquet(file_path, **kwargs)
            else:
                raise ValueError(f"Unsupported export format: {format}")
                
            print(f"Successfully exported data to {file_path}")
            
        except Exception as e:
            raise ExportError(f"Failed to export data: {str(e)}")

    def export_summary(self,
                      data_name: str,
                      file_path: str) -> None:
        """
        Export data summary statistics
        
        Args:
            data_name: Name of the dataset
            file_path: Path to save the summary
        """
        try:
            if data_name not in self.dataframes:
                raise KeyError(f"Dataset '{data_name}' not found")
                
            df = self.dataframes[data_name]
            
            # Convert numeric types to Python native types
            def convert_to_native_types(obj):
                if isinstance(obj, (np.int64, np.int32)):
                    return int(obj)
                elif isinstance(obj, (np.float64, np.float32)):
                    return float(obj)
                elif isinstance(obj, pd.Series):
                    return obj.to_dict()
                elif isinstance(obj, dict):
                    return {k: convert_to_native_types(v) for k, v in obj.items()}
                elif isinstance(obj, (list, tuple)):
                    return [convert_to_native_types(i) for i in obj]
                return obj
            
            # Create summary
            summary = {
                'dataset_name': data_name,
                'total_rows': int(len(df)),  # Convert to native int
                'total_columns': int(len(df.columns)),  # Convert to native int
                'columns': list(df.columns),  # Convert to list
                'numeric_columns': list(df.select_dtypes(include=['int64', 'float64']).columns),
                'categorical_columns': list(df.select_dtypes(include=['object']).columns),
                'missing_values': convert_to_native_types(df.isnull().sum().to_dict()),
                'numeric_summary': convert_to_native_types(df.describe().to_dict()),
                'memory_usage': int(df.memory_usage(deep=True).sum())  # Convert to native int
            }
            
            # Create directory if it doesn't exist
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            
            # Export summary to JSON
            import json
            with open(file_path, 'w') as f:
                json.dump(summary, f, indent=2)
                
            print(f"Successfully exported summary to {file_path}")
            
        except Exception as e:
            raise ExportError(f"Failed to export summary: {str(e)}")

class ExportError(Exception):
    """Custom exception for export errors"""
    pass