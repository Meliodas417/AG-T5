from .core import operations, models
from .advanced import data_processor, data_validator, kpi_calculator, time_series
from .server import start_server

__all__ = [
    'operations',
    'models',
    'data_processor',
    'data_validator',
    'kpi_calculator',
    'time_series',
    'launch_ui'
]

def launch_ui():
    """Launch the KPI Formula UI"""
    start_server()
