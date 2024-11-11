from typing import Union, List, Dict, Any, Optional
from datetime import datetime

NumericType = Union[int, float]

class Expression:
    def __init__(self, value: Any):
        self.value = value

    def evaluate(self) -> NumericType:
        return float(self.value)

class HistoryItem:
    def __init__(self, 
                 operation: str, 
                 inputs: List[Any], 
                 result: Any,
                 name: Optional[str] = None,
                 headers: Optional[List[str]] = None,
                 data: Optional[List[List[str]]] = None):
        self.operation = operation
        self.inputs = inputs
        self.result = result
        self.name = name
        self.headers = headers or []
        self.data = data or []
        self.timestamp = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        return {
            'operation': self.operation,
            'inputs': self.inputs,
            'result': self.result,
            'name': self.name,
            'headers': self.headers,
            'data': self.data,
            'timestamp': self.timestamp
        }

class JoinConfig:
    def __init__(self, 
                 left_table: str, 
                 right_table: str, 
                 left_key: str, 
                 right_key: str,
                 join_type: str = 'inner'):
        self.left_table = left_table
        self.right_table = right_table
        self.left_key = left_key
        self.right_key = right_key
        self.join_type = join_type

    def to_dict(self) -> Dict[str, str]:
        return {
            'left_table': self.left_table,
            'right_table': self.right_table,
            'left_key': self.left_key,
            'right_key': self.right_key,
            'join_type': self.join_type
        }
