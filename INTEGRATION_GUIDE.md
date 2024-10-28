# AG-T5-KPI Integration Guide

## 1. Environment Setup
Before integrating the KPI Uploader, ensure that the following environment setup steps have been completed:

Node.js and npm must be installed. You can check if these are installed by running:

```bash
node -v
npm -v
```
If they are not installed, download and install from [nodejs.org](https://nodejs.org/).

React and the necessary libraries (e.g., Chart.js) must be installed. You can install them using npm:

```bash
npm install
```

## 2. Install Required Dependencies
Ensure that the following dependencies are installed:

- `react-chartjs-2` for chart rendering
- `chart.js` for chart creation
- `papaparse` for csv parsing

If these libraries are not already installed in your project, install them by running:

```bash
npm install react-chartjs-2 chart.js papaparse
```

## 3. Project Structure
Here is the project structure for the KPI Uploader integration:

```bash
/my-app
│
├── /src
│   ├── App.js               # Main application file
│   ├── kpi-formula-parser.js # CSV file parsing and expression handling
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

## 4. Running the Application
To run the KPI Uploader in your local environment, execute the following commands:

```bash
npm start
```

## 5. File Upload and Chart Visualization
The `App.js` component handles file uploading, CSV parsing, table rendering, and chart visualization.

Once a CSV file is uploaded, the data is parsed using PapaParse, and the table and charts (Line chart and Doughnut chart) are displayed.

Make sure your CSV file contains the following required columns for full functionality:
- `Timestamp`
- `Signal_Strength`
- `Application_Type`
- `Resource_Allocation`
  
You can modify or extend these columns as needed in your CSV files.

## 6. Pagination for CSV Table
The application automatically paginates the CSV data, displaying 10 rows per page. You can adjust the number of rows per page by modifying the `rowsPerPage` constant in `App.js`.

## 7. Adding Expressions
The `kpi-formula-parser.js` file provides functionality for users to generate new columns by entering expressions based on the existing columns in the CSV data.

Users can input mathematical expressions (e.g., `column1 + column2`) to calculate new values and add them as new columns to the dataset.

New columns can be deleted using the delete button next to each added column.

## 8. Customization
If you need to customize the chart appearance or behavior, modify the `generateChartData` and `generatePieChartData` functions in `App.js`. You can also adjust chart options like axis labels in the `chartOptions` object.

For additional styling, you can modify the `KPIUploader.css` file. You might want to:
- Adjust the layout of charts.
- Customize table styles.
- Modify the pagination buttons.

## 9. Development
When you are ready to deploy the application, run:

```bash
npm run build
```

This will create an optimized build of the app in the `/build` directory, which can then be deployed to any static site host (e.g., Netlify, Vercel, GitHub Pages).


## 10. Further Steps
If you need to extend the functionality:
- Adding New Charts: You can add more chart types by following the example of the Line and Doughnut charts in `App.js`. The `react-chartjs-2` library supports various types like Bar, Pie, and Radar charts.
- Advanced CSV Features: If your use case requires advanced data manipulation, consider implementing more complex formula parsing or additional features like filtering and sorting.
