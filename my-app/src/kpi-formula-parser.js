import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import alasql from 'alasql';
import './KPIUploader.css';

function KPIUploader({ onFileUpload, onTableCreated, onCommonColumnsChange, currentData, columnNames, setColumnNames }) {
    const [csvData, setCsvData] = useState([]);
    const [expression, setExpression] = useState('');
    const [fileName, setFileName] = useState('');
    const [addedColumns, setAddedColumns] = useState([]);
    const [savedColumns, setSavedColumns] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);

    // Initialize savedColumns with original columns when they are set
    useEffect(() => {
        if (savedColumns.length === 0) {
            setSavedColumns(columnNames);
        }
    }, [columnNames]);

    const calculateCommonColumns = () => {
        const allTables = Object.keys(alasql.tables);
        if (allTables.length > 1) {
            let common = null;

            allTables.forEach((tableName, index) => {
                const tableColumns = alasql(`SHOW COLUMNS FROM ${tableName}`).map(col => col.columnid);
                console.log(`Columns in ${tableName}:`, tableColumns);

                if (index === 0) {
                    common = new Set(tableColumns);
                } else {
                    common = new Set([...common].filter(x => tableColumns.includes(x)));
                }
            });

            const commonArray = Array.from(common);
            console.log('Common Columns across all tables:', commonArray);
            onCommonColumnsChange(commonArray);
        } else {
            console.log('Not enough tables to find common columns.');
            onCommonColumnsChange([]);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newFileName = file.name.replace(/\.[^/.]+$/, "");
            setFileName(file.name);
            setCsvData([]);
            setExpression('');
            setAddedColumns([]);
            setSavedColumns([]);
            setFileUploaded(true);

            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    if (result.data.length === 0) {
                        console.error('No data found in CSV file.');
                        return;
                    }

                    const columns = Object.keys(result.data[0]);
                    setCsvData(result.data);
                    setColumnNames(columns);
                    setSavedColumns(columns); // Set all original columns as saved
                    onFileUpload(file.name, result.data, columns);

                    // Move this line here to ensure it's called only once
                    onTableCreated(newFileName);

                    // Use the file name (without extension) as the table name
                    alasql(`DROP TABLE IF EXISTS ${newFileName}`);
                    alasql(`CREATE TABLE ${newFileName} (${columns.map(col => `[${col}] STRING`).join(', ')})`);
                    alasql(`INSERT INTO ${newFileName} SELECT ${columns.map(col => `[${col}]`).join(', ')} FROM ?`, [result.data]);

                    // Calculate common columns after creating the new table
                    calculateCommonColumns();
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
                                console.warn(`Non-numeric data in column ${match}:`, row);
                                return 'NaN';
                            }
                            return value;
                        }
                        return match;
                    }
                );

                if (evaluatedExpression.includes('NaN')) {
                    return row; // Return the original row without adding the new column
                }

                console.log(`Evaluating expression: ${evaluatedExpression}`);
                const newValue = eval(evaluatedExpression);
                
                return {
                    ...row,
                    [newColumnName]: newValue
                };
            });

            setCsvData(updatedData);
            setColumnNames(prevColumnNames => [...prevColumnNames, newColumnName]);
            setAddedColumns(prevAddedColumns => [...prevAddedColumns, newColumnName]);
            // This line is commented out, but double-check it's actually commented in your code
            // setSavedColumns(prevSavedColumns => [...prevSavedColumns, newColumnName]);
            onFileUpload(fileName, updatedData, [...columnNames, newColumnName]);
        } catch (error) {
            console.error('Error in expression:', error.message);
            alert('Error in expression: ' + error.message);
        }
    };

    const handleDeleteColumn = (columnName) => {
        const updatedData = csvData.map(row => {
            const { [columnName]: _, ...rest } = row;
            return rest;
        });

        setCsvData(updatedData);
        setAddedColumns(addedColumns.filter(column => column !== columnName));
        setColumnNames(columnNames.filter(column => column !== columnName));
        setSavedColumns(savedColumns.filter(column => column !== columnName));
        onFileUpload(fileName, updatedData, columnNames.filter(column => column !== columnName));
    };

    const handleToggleSaveColumn = (columnName) => {
        setSavedColumns(prevSavedColumns => {
            if (prevSavedColumns.includes(columnName)) {
                return prevSavedColumns.filter(col => col !== columnName);
            } else {
                return [...prevSavedColumns, columnName];
            }
        });
    };

    const handleExport = () => {
        if (!currentData || currentData.length === 0) return;

        const exportFileName = prompt("Enter a name for the exported file:", "exported_data.csv");
        if (!exportFileName) {
            alert("File name cannot be empty.");
            return;
        }

        // Get the original columns and the explicitly saved new columns
        const originalColumns = columnNames.filter(col => !addedColumns.includes(col));
        const savedNewColumns = addedColumns.filter(col => savedColumns.includes(col));
        const exportColumns = [...originalColumns, ...savedNewColumns];

        // Filter and order the data based on exportColumns
        const exportData = currentData
            .map(row => {
                const orderedRow = {};
                exportColumns.forEach(col => {
                    if (row.hasOwnProperty(col)) {
                        orderedRow[col] = row[col];
                    }
                });
                return orderedRow;
            })
            .filter(row => {
                // Check if the row has any non-empty values in the original columns
                return originalColumns.some(col => row[col] !== '' && row[col] !== null && row[col] !== undefined);
            });

        const csvContent = Papa.unparse(exportData, {
            columns: exportColumns, // Specify the column order explicitly
            header: true,
            skipEmptyLines: true // This should help prevent extra empty lines
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', exportFileName.endsWith('.csv') ? exportFileName : `${exportFileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="file-upload">
                <input type="file" accept=".csv" onChange={handleFileUpload} />
            </div>

            {csvData.length > 0 && (
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
                                        <button onClick={() => handleToggleSaveColumn(column)}>
                                            {savedColumns.includes(column) ? 'Saved' : 'Save'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No columns added yet.</p>
                        )}
                    </div>

                    <div>
                        <button onClick={handleExport}>Export CSV</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default KPIUploader;
