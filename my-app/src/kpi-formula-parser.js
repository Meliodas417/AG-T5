import React, { useState } from 'react';
import Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap

function KPIUploader() {
  const [csvData, setCsvData] = useState(null);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [kpiValues, setKpiValues] = useState({});
  const [calculationExpression, setCalculationExpression] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const columns = Object.keys(result.data[0]); // Extract column names from first row
          setCsvData(result.data); // Set the parsed data
          setColumnNames(columns); // Set column names
        },
      });
    }
  };

  // Function to calculate KPI values for a given column
  const calculateKPI = (column) => {
    const values = csvData
      .map((row) => parseFloat(row[column]))
      .filter((val) => !isNaN(val)); // Filter out non-numeric values

    if (values.length === 0) {
      // If no numeric values are present, return N/A for all KPIs
      return { min: 'N/A', max: 'N/A', avg: 'N/A', sum: 'N/A' };
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = sum / values.length || 0;

    return { min, max, avg, sum };
  };

  // Function to handle column selection and calculate KPIs
  const handleColumnSelection = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
      const { [column]: _, ...rest } = kpiValues; // Remove column KPI from state
      setKpiValues(rest);
    } else {
      const kpiForColumn = calculateKPI(column);
      setSelectedColumns([...selectedColumns, column]);
      setKpiValues({
        ...kpiValues,
        [column]: kpiForColumn,
      });
    }
  };

  // Function to handle dropdown selection
  const handleKPISelect = (column, kpi) => {
    const expressionPart = `${column}.${kpi}`;
    setCalculationExpression((prev) => prev + (prev.length ? ' ' : '') + expressionPart);
  };

  // Function to evaluate user input calculation
  const handleCalculation = () => {
    try {
      // Replace KPI placeholders with actual values from kpiValues
      const evaluatedExpression = calculationExpression.replace(
        /([a-zA-Z0-9_]+)\.(min|max|avg|sum)/g,
        (match, col, kpi) => {
          // Use the kpiValues to get the actual value
          const value = kpiValues[col]?.[kpi];
          if (value === 'N/A') {
            throw new Error(`KPI value for ${col}.${kpi} is not a number`);
          }
          return value;
        }
      );

      const result = eval(evaluatedExpression);
      setCalculationResult(result);
    } catch (error) {
      setCalculationResult('Error in calculation: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">CSV KPI Uploader</h2>
      
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">Upload CSV File</label>
        <input className="form-control" type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      {columnNames.length > 0 && (
        <div>
          <h3 className="my-3">Select Columns for KPI Calculation:</h3>
          <div className="column-selection">
            {columnNames.map((column) => (
              <div key={column} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={column}
                  name={column}
                  value={column}
                  onChange={() => handleColumnSelection(column)}
                  style={{ marginRight: '10px' }}
                />
                <label htmlFor={column} style={{ marginRight: '20px', minWidth: '100px' }}>
                  {column}
                </label>
                <select
                  onChange={(e) => handleKPISelect(column, e.target.value)}
                  defaultValue=""
                  style={{ width: '115px' }} 
                >
                  <option value="" disabled>
                    Select Value
                  </option>
                  <option value="min">Min</option>
                  <option value="max">Max</option>
                  <option value="avg">Avg</option>
                  <option value="sum">Sum</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="my-3">Perform Calculation:</h3>
        {selectedColumns.length > 0 && (
          <div>
            <p>Use the following variables for calculations:</p>
            <ul className="list-group">
              {selectedColumns.map((column) => (
                <li key={column} className="list-group-item">
                  {column}: min={kpiValues[column]?.min}, max={kpiValues[column]?.max}, avg={kpiValues[column]?.avg}, sum={kpiValues[column]?.sum}
                </li>
              ))}
            </ul>
          </div>
        )}
        <textarea
          className="form-control my-3"
          rows="4"
          value={calculationExpression}
          placeholder="e.g. column1.sum + column2.avg"
          onChange={(e) => setCalculationExpression(e.target.value)} // Allow user to modify it
        />
        <button className="btn btn-primary" onClick={handleCalculation}>Calculate</button>

        {calculationResult !== null && (
          <div className="mt-3">
            <h4>Calculation Result:</h4>
            <p className="alert alert-info">{calculationResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default KPIUploader;
