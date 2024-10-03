import React, { useState } from 'react';
import Papa from 'papaparse';
import './KPIUploader.css';

function KPIUploader({ onFileUpload }) {
    const [csvData, setCsvData] = useState(null);
    const [columnNames, setColumnNames] = useState([]);
    const [expression, setExpression] = useState('');
    const [fileName, setFileName] = useState('');
    const [addedColumns, setAddedColumns] = useState([]); // Track added columns

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setCsvData(null);
            setColumnNames([]);
            setExpression('');
            setAddedColumns([]); // Reset added columns on new file upload

            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    const columns = Object.keys(result.data[0]);
                    setCsvData(result.data);
                    setColumnNames(columns);
                    onFileUpload(file.name, result.data);
                },
            });
        }
    };

    const handleExpression = () => {
        if (!csvData) return;

        const newColumnName = prompt("Enter a name for the new column:");
        if (!newColumnName) {
            alert("Column name cannot be empty.");
            return;
        }

        try {
            console.log("Column Names:", columnNames);

            const updatedData = csvData.map((row) => {
                const evaluatedExpression = expression.replace(
                    /([a-zA-Z_][a-zA-Z0-9_]*)/g,
                    (match) => {
                        if (columnNames.includes(match)) {
                            const rawValue = row[match];
                            console.log(`Raw value for ${match}:`, rawValue);
                            const value = parseFloat(rawValue);
                            console.log(`Parsed value for ${match}:`, value);
                            if (isNaN(value)) {
                                console.warn(`Skipping row due to non-numeric data in column ${match}:`, row);
                                return 'NaN';
                            }
                            return value;
                        }
                        return match;
                    }
                );

                if (evaluatedExpression.includes('NaN')) {
                    return row;
                }

                console.log(`Evaluating expression: ${evaluatedExpression}`);
                const newValue = eval(evaluatedExpression);
                return { ...row, [newColumnName]: newValue };
            });

            setCsvData(updatedData);
            setColumnNames([...columnNames, newColumnName]);
            setAddedColumns([...addedColumns, newColumnName]); // Track the new column
            onFileUpload(fileName, updatedData);
        } catch (error) {
            console.error('Error in expression:', error.message);
            alert('Error in expression: ' + error.message);
        }
    };

    const handleDeleteColumn = (columnName) => {
        const updatedData = csvData.map(row => {
            const { [columnName]: _, ...rest } = row; // Remove the column
            return rest;
        });

        setCsvData(updatedData);
        setAddedColumns(addedColumns.filter(column => column !== columnName)); // Remove from added columns
        setColumnNames(columnNames.filter(column => column !== columnName)); // Remove from column names
        onFileUpload(fileName, updatedData); // Update the parent component with the new data
    };

    return (
        <div>
            <div className="file-upload">
                <input type="file" accept=".csv" onChange={handleFileUpload} />
            </div>

            {csvData && (
                <>
                    <div className="column-selection">
                        <h3>Available Columns:</h3>
                        {columnNames.map((column) => (
                            <div key={column} className="column-item">
                                <label>{column}</label>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3>Enter Expression:</h3>
                        <textarea
                            rows="4"
                            cols="50"
                            style={{ width: '300px' }}
                            value={expression}
                            placeholder="e.g. column1 + column2"
                            onChange={(e) => setExpression(e.target.value)}
                        />
                        <br />
                        <button onClick={handleExpression}>Generate New Column</button>
                    </div>

                    <div className="added-columns">
                        <h3>Added Columns:</h3>
                        {addedColumns.length > 0 ? (
                            <ul>
                                {addedColumns.map((column) => (
                                    <li key={column}>
                                        {column}
                                        <button onClick={() => handleDeleteColumn(column)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No columns added yet.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default KPIUploader;