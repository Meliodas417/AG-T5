"""
KPI Formula Package
A Python package for KPI calculations and data processing.
"""

from .core.data_manager import DataManager
from .core.operations import ExpressionManager
from .core.models import HistoryItem
from .advanced.data_processor import DataProcessor
from .advanced.data_validator import DataValidator
from .advanced.kpi_calculator import KPICalculator
from .advanced.time_series import TimeSeriesAnalyzer

__version__ = "0.2.5"

__all__ = [
    'DataManager',
    'ExpressionManager',
    'HistoryItem',
    'DataProcessor',
    'DataValidator',
    'KPICalculator',
    'TimeSeriesAnalyzer'
]
