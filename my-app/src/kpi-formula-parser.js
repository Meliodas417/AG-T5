import React, { useState } from 'react';
import Papa from 'papaparse';
import './KPIUploader.css';

function KPIUploader({ onFileUpload }) {
    const [csvData, setCsvData] = useState(null);
    const [columnNames, setColumnNames] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [kpiValues, setKpiValues] = useState({});
    const [calculationExpression, setCalculationExpression] = useState('');
    const [calculationResult, setCalculationResult] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);  // 保存文件名
            setCsvData(null);  // Reset previous data
            setColumnNames([]);
            setSelectedColumns([]);
            setKpiValues({});
            setCalculationExpression('');
            setCalculationResult(null);
    
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    const columns = Object.keys(result.data[0]); // Extract column names from first row
                    setCsvData(result.data); // Set the parsed data
                    setColumnNames(columns); // Set column names
                    onFileUpload(file.name, result.data); // Trigger the callback for file upload
                },
            });
        }
    };
  

    const prepareDoughnutChartData = (column) => {
        if (!csvData) return {};

        // Group data by category and count occurrences
        const categoryCounts = csvData.reduce((acc, row) => {
            const value = row[column];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#99CC33', '#FF9F40'], // colors for the chart
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#99CC33', '#FF9F40'],
                },
            ],
        };
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
        <div>
            <div className="file-upload">
                <input type="file" accept=".csv" onChange={handleFileUpload}/>
            </div>


            <div className="column-selection">
                <h3>Select Columns for KPI Calculation:</h3>
                {columnNames.map((column) => (
                    <div key={column} className="column-item">
                        <input
                            type="checkbox"
                            id={column}
                            name={column}
                            value={column}
                            onChange={() => handleColumnSelection(column)}
                        />
                        <label htmlFor={column}>{column}</label>
                        <select
                            onChange={(e) => handleKPISelect(column, e.target.value)}
                            defaultValue=""
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

            <div>
                <h3>Perform Calculation:</h3>
                {selectedColumns.length > 0 && (
                    <div>
                        <p>Use the following variables for calculations:</p>
                        <ul>
                            {selectedColumns.map((column) => (
                                <li key={column}>
                                    {column}: min={kpiValues[column]?.min}, max={kpiValues[column]?.max}, avg={kpiValues[column]?.avg}, sum={kpiValues[column]?.sum}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <textarea
                    rows="4"
                    cols="50"
                    style={{ width: '300px' }}
                    value={calculationExpression}
                    placeholder="e.g. column1.sum + column2.avg"
                    onChange={(e) => setCalculationExpression(e.target.value)} // Allow user to modify it
                />
                <br />
                <button onClick={handleCalculation}>Calculate</button>

                {calculationResult !== null && (
                    <div className="result">
                        <h4>Calculation Result:</h4>
                        <p>{calculationResult}</p>
                    </div>
                )}
            </div>
        </div>
    ); 

}

export default KPIUploader;
