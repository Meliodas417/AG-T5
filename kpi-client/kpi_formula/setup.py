from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="kpi-formula-t5",
    version="0.2.4",
    author="4485-t5",
    author_email="leoren1314@gmail.com",
    description="A KPI calculation tool",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/leoren1314/kpi-formula",
    packages=find_packages(),
    include_package_data=True,
    package_data={
        'kpi_formula': ['examples/*', 'tests/*'],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
    python_requires=">=3.7",
    install_requires=[
        "pandas>=1.0.0",
        "numpy>=1.18.0",
        "openpyxl>=3.0.0",
        "sqlalchemy>=1.4.0",     
        "pymysql>=1.0.0",        
        "psycopg2-binary>=2.9.0", 
        "pyarrow>=5.0.0",
        "statistics",
        "flask>=2.0.0",
    ],
    extras_require={
        'dev': [
            'pytest>=6.0.0',
            'pytest-cov>=2.0.0',
            'black>=21.0.0',
        ],
        'mysql': ['pymysql>=1.0.0'],
        'postgresql': ['psycopg2-binary>=2.9.0'],
    },
    project_urls={
        "Bug Reports": "https://github.com/Meliodas417/AG-T5",
        "Source": "https://github.com/Meliodas417/AG-T5",
    },
)