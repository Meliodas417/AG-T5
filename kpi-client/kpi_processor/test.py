from kpi_processor import KPIOperations
import pandas as pd

# Join tables
left_data = {
    'headers': ['id', 'name', 'value'],
    'data': [
        [1, 'A', 10],
        [2, 'B', 20],
        [3, 'C', 30]
    ]
}

right_data = {
    'headers': ['id', 'description', 'amount'],
    'data': [
        [1, 'Desc1', 100],
        [2, 'Desc2', 200],
        [4, 'Desc4', 400]
    ]
}

left_col = 'id'
right_col = 'id'

result = KPIOperations.join_tables(
    left_data=left_data,
    right_data=right_data,
    left_col=left_col,
    right_col=right_col
)

print("Join Tables Result:")
print(pd.DataFrame(result['data'], columns=result['headers']))

# Calculate expressions
data = {
    'headers': ['id', 'revenue', 'costs'],
    'data': [
        [1, 1000, 300],
        [2, 1500, 500],
        [3, 2000, 700]
    ]
}

expression = {
    'operation': 'add',
    'sourceColumn': 'revenue',
    'targetColumn': 'costs'
}

result = KPIOperations.calculate_expression(
    data=data,
    expression=expression
)

print("Calculate Expression Result:")
print(pd.DataFrame({expression['operation']: result}))