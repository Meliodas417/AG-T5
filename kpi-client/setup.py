from setuptools import setup, find_packages

setup(
    name="kpi-processor",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        'pandas>=1.0.0',
    ],
    author="Your Name",
    description="KPI Processing Module for Data Analysis",
)