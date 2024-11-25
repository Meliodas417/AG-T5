import pandas as pd

class KPIOperations:
    @staticmethod
    def join_tables(left_data, right_data, left_col, right_col, join_type='inner'):
        """Join two tables based on columns"""
        left_df = pd.DataFrame(left_data['data'], columns=left_data['headers'])
        right_df = pd.DataFrame(right_data['data'], columns=right_data['headers'])
        
        result = pd.merge(
            left_df,
            right_df,
            left_on=left_col,
            right_on=right_col,
            how=join_type
        )
        
        return {
            'headers': result.columns.tolist(),
            'data': result.values.tolist()
        }

    @staticmethod
    def calculate_expression(data, expression):
        """Calculate expressions between columns"""
        df = pd.DataFrame(data['data'], columns=data['headers'])
        
        operations = {
            'add': lambda x, y: x + y,
            'subtract': lambda x, y: x - y,
            'multiply': lambda x, y: x * y,
            'divide': lambda x, y: x / y
        }
        
        if expression['operation'] in operations:
            result = operations[expression['operation']](
                df[expression['sourceColumn']],
                df[expression['targetColumn']]
            )
            return result.tolist()
        return None