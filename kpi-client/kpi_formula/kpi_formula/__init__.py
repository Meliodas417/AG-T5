"""
KPI Formula Package
A Python package for KPI calculations and data processing.
"""

from .core.data_manager import DataManager
from .advanced.data_processor import DataProcessor
from .advanced.data_validator import DataValidator
from .advanced.kpi_calculator import KPICalculator
from .advanced.time_series import TimeSeriesAnalyzer

__version__ = "0.2.0"

__all__ = [
    'DataManager',
    'DataProcessor',
    'DataValidator',
    'KPICalculator',
    'TimeSeriesAnalyzer'
]
