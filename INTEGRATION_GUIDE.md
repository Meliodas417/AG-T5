# AG-T5-KPI Integration Guide

## 1. Environment Setup
Before integrating the KPI Uploader, ensure that the following environment setup steps have been completed:

1. Node.js and npm must be installed. You can check if these are installed by running:
   ```bash
   node -v
   npm -v
   ```
   If they are not installed, download and install from [nodejs.org](https://nodejs.org/).

2. Python: Python (preferably 3.12 or later) is required for running the FastAPI server backend. Ensure Python is installed by running:
   ```bash
   python --version
   ```
   If Python is not installed, download it from [python.org](https://www.python.org/downloads/).

3. FastAPI: The backend API is powered by FastAPI. To install FastAPI and Uvicorn (the ASGI server), run:
   ```bash
   pip install fastapi uvicorn
   ```

4. React: Ensure that React and the necessary libraries (e.g., Chart.js, alasql) are installed. You can install them using npm:
   ```bash
   npm install
   ```

## 2. Install Required Dependencies
Ensure that the following dependencies are installed:

- `react-chartjs-2` for chart rendering
- `chart.js` for chart creation
- `papaparse` for csv parsing
- `alasql` for SQL-like querying on the frontend

If these libraries are not already installed in your project, install them by running:

```bash
npm install react-chartjs-2 chart.js papaparse alasql
```

## 3. Project Structure
Here is the project structure for the KPI Uploader integration:

```bash
/my-app
│
├── /src
│   ├── App.js               # Main application file
│   ├── createDataBase.py     # Script to create and populate the SQLite database
│   ├── kpi-formula-parser.js # CSV file parsing and expression handling
│   ├── main.py               # FastAPI server for handling database operations
│   ├── index.js             # Entry point for React
│   ├── KPIUploader.css      # Stylesheet for KPI uploader component
│   └── /assets              # Optional folder for any static assets like logos
│
├── /public
│   └── index.html           # Main HTML file
│
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Lock file for npm dependencies
└── README.md                # Project documentation
```

## 4. Database Setup (Switch from MySQL to SQLite)
1. SQLite Setup: We have transitioned from MySQL to SQLite as the primary database for this project.
   - SQLite database files will be automatically created by the `createDataBase.py` script.
   - No separate database server is required for SQLite; it stores everything locally in a single `.db` file.

2. Running the Database Setup Script:
   - Before running the project, execute the `createDataBase.py` file to create and populate the database:
     ```
     python src/createDataBase.py
     ```
   - This will create an SQLite database file called `database_sample_data.db` and populate it with sample KPI data.

3. Updating FastAPI Server:
   - Ensure you have FastAPI and Uvicorn installed. To start the FastAPI server, run:
     ```
     uvicorn src.main:app --reload --port 8001
   - This will run the FastAPI server on port 8001, and it will handle API requests for fetching data from the SQLite database.


## 5. Running the Application
To run the React frontend and FastAPI backend:

1. Running the Frontend (React):
   - Start the React application by running:
     ```
     npm start
     ```
   - Ensure your React app is running on port `3000`. If there is a conflict, stop the conflicting process or adjust the port settings.

2. Running the Backend (FastAPI):
   - Start the FastAPI server by running the following command in a separate terminal window:
     ```
     uvicorn src.main:app --reload --port 8001
     ```
   - Ensure the FastAPI server runs on port `8001` for proper communication with the React frontend.


## 6. File Upload and Chart Visualization
The frontend has been updated to support fetching data directly from the SQLite database:

1. Fetching Available Tables:
   - The `App.js` component now includes functionality to retrieve available tables from the SQLite database via the `/api/tables` endpoint.

2. Selecting a Table:
   - The user can select a table from the available list, and the frontend will dynamically fetch data from the selected table.

3. API Endpoints:
   - Get Available Tables: `GET /api/tables`
   - Fetch KPI Data: `GET /api/kpis?table=<table_name>`
   - Import KPI Data: `POST /api/import_kpis`


## 7. File Upload and Chart Visualization
The `App.js` component handles file uploading, CSV parsing, and chart visualization.

- CSV File Upload: You can upload CSV files and visualize the data in both table and chart formats.
- KPI Table Fetching: You can also select an existing table from the SQLite database and visualize the data.
- Line Chart and Doughnut Chart: The data is visualized using two chart types, which can be customized in the `generateChartData` and `generatePieChartData` functions in `App.js`.


## 8. Database Integration and Export
The application supports two types of data import/export:

1. Export CSV to Database:
   - The `kpi-formula-parser.js` file now supports exporting parsed CSV data to the SQLite database via the `/api/import_kpis` endpoint.
2. SQL Join Operation:
   - You can perform SQL-like joins using AlaSQL in the frontend. The application allows you to join data between CSV files and database tables dynamically.


## 9. Further Steps and Customization
- Adding New Charts: You can extend the application by adding more chart types. For example, the `react-chartjs-2` library supports bar charts, radar charts, and more.
- Advanced SQL Features: If your use case requires complex SQL queries, you can extend the FastAPI backend to support more advanced queries or add filtering/sorting functionality on the frontend.


## 10. Development
When you are ready to deploy the application, run:

```bash
npm run build
```
This will generate the production-ready code in the `/build` directory, which can be hosted on static site platforms like Netlify, Vercel, or GitHub Pages.

