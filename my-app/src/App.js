import React, { useState, useEffect } from 'react';
import './KPIUploader.css';
import KPIUploader from './kpi-formula-parser';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import alasql from 'alasql';
import { Table } from '../node_modules/@mui/material/index';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function App() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileName, setFileName] = useState('');
    const [csvData, setCsvData] = useState([]);
    const [dbData, setDbData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState('csv');
    const [tableNames, setTableNames] = useState([]);
    const rowsPerPage = 10;
    const [joinedData, setJoinedData] = useState(null);
    const [commonColumns, setCommonColumns] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [isJoinedData, setIsJoinedData] = useState(false);
    const [columnNames, setColumnNames] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');

    // Function to handle when a new table is created
    const handleTableCreated = (tableName) => {
        console.log(`Attempting to add table: ${tableName}`);
        setTableNames((prevTableNames) => {
            if (!prevTableNames.includes(tableName)) {
                console.log(`Adding new table: ${tableName}`);
                return [...prevTableNames, tableName];
            }
            console.log(`Table ${tableName} already exists, not adding`);
            return prevTableNames;
        });
        calculateCommonColumns();
    };

    // Function to handle table removal
    const handleRemoveTable = (tableName) => {
        setTableNames((prevTableNames) => prevTableNames.filter(name => name !== tableName));

        setCurrentData([]);
        setColumnNames([]);
    };

    const handleTableClick = (tableName) => {
        if (alasql.tables[tableName]) {
            const data = alasql(`SELECT * FROM [${tableName}]`);
            setCurrentData(data);
            setColumnNames(Object.keys(data[0] || {}));
            setIsJoinedData(tableName === "Joined_Data");
            setFileName(tableName);
            setCurrentPage(1);
        } else {
            fetchTableData(tableName);
        }
    };

    // Fetch available tables from the database
    const fetchAvailableTables = async () => {
        const url = 'http://localhost:8001/api/tables';
        console.log(`Fetching tables from: ${url}`);
        try {
            const response = await fetch(url);
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tables = await response.json();
            console.log('Fetched tables:', tables);
            setAvailableTables(tables);
            // Remove this line:
            // if (tables.length > 0) {
            //     setSelectedTable(tables[0]);
            // }
        } catch (error) {
            console.error('Error fetching tables:', error);
            alert('Error fetching tables: ' + error.message);
        }
    };

    // Fetch data from the selected table
    const fetchTableData = async (tableName) => {
        console.log(`Fetching data for table: ${tableName}`);
        try {
            const response = await fetch(`http://localhost:8001/api/kpis?table=${tableName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            
            // Use handleFileUpload to process the data as if it were a CSV
            handleFileUpload(tableName, data, Object.keys(data[0]));
            
            setIsDataLoaded(true);
            console.log('State updated with new data');
        } catch (error) {
            console.error('Error fetching data from table:', error);
            alert('Error fetching data from table: ' + error.message);
        }
    };

    // Use effect to fetch data from the selected table
    useEffect(() => {
        if (dataSource === 'db' && selectedTable) {
            console.log(`Fetching data for selected table: ${selectedTable}`);
            fetchTableData(selectedTable);
        }
    }, [selectedTable, dataSource]);

    // New function to create AlaSQL table
    const createAlaSQLTable = (tableName, data) => {
        if (data && data.length > 0) {
            try {
                alasql(`DROP TABLE IF EXISTS [${tableName}]`);
                const createTableQuery = `CREATE TABLE [${tableName}] (${Object.keys(data[0]).map(col => `[${col}] STRING`).join(', ')})`;
                alasql(createTableQuery);
                alasql(`INSERT INTO [${tableName}] SELECT * FROM ?`, [data]);
                console.log(`Data inserted into AlaSQL table: ${tableName}`);
            } catch (e) {
                console.error('Error in AlaSQL operations:', e);
            }
        }
    };

    // Modify the useEffect for data source change
    useEffect(() => {
        if (dataSource === 'db') {
            fetchAvailableTables();
        } else {
            setIsDataLoaded(false);
            setFileUploaded(false);
            setFileName('');
            setCurrentData([]);
            setColumnNames([]);
        }
    }, [dataSource]);

    // Modify handleFileUpload to accept data directly
    const handleFileUpload = (uploadedFileName, data, columns = null) => {
        setFileUploaded(true);
        setFileName(uploadedFileName);
        setCsvData(data);
        setCurrentData(data);
        setColumnNames(columns || Object.keys(data[0]));
        setIsJoinedData(uploadedFileName.startsWith("Joined_Data"));
        setCurrentPage(1);
        setIsDataLoaded(true);

        // Create a unique table name for the file
        const tableName = uploadedFileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "_");
        createAlaSQLTable(tableName, data);
        handleTableCreated(tableName);
    };

    // Example SQL operation: Join CSV and DB data
    const performJoinOperation = () => {
        try {
            if (!alasql.tables.csvData || !alasql.tables.dbData) {
                console.log('Tables not ready for join operation');
                return;
            }
            const result = alasql('SELECT csvData.*, dbData.department FROM csvData JOIN dbData ON csvData.id = dbData.id');
            console.log('Joined Data:', result);
        } catch (error) {
            console.error('Error performing join operation:', error.message);
        }
    };

    // Call performJoinOperation when data is ready
    useEffect(() => {
        if (fileUploaded && csvData.length > 0 && dbData.length > 0) {
            performJoinOperation();
        }
    }, [fileUploaded, csvData, dbData]);

    const handleCommonColumnsChange = (columns) => {
        setCommonColumns(columns);
    };

    const generateChartData = () => {
        const data = dataSource === 'csv' ? csvData : dbData;
        if (!data || data.length === 0) {
            console.log('No data available for generating chart');
            return { labels: [], datasets: [] };
        }

        const labels = data.map((row) => row['Timestamp']);
        const dataValues = data.map((row) => row['Signal_Strength']);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Signal Strength Over Time',
                    data: dataValues,
                    borderColor: '#99CC33',
                    backgroundColor: '#99CC33',
                },
            ],
        };
    };


    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Timestamp',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Signal Strength',
                },
            },
        },
    };

    // Add this function before the renderTable function
    const renderPagination = () => {
        const totalPages = Math.ceil(currentData.length / rowsPerPage);
        return (
            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    const renderTable = () => {
        const data = currentData;

        if (!data || data.length === 0) {
            console.log('No data available for rendering table');
            return null;
        }

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = data.slice(startIndex, endIndex);

        return (
            <div className="csv-table-container">
                <table className="csv-table">
                    <thead>
                        <tr>
                            {columnNames.map((column) => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columnNames.map((column) => (
                                    <td key={column}>{row[column]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {renderPagination()}
            </div>
        );
    };

    const handleClearDataInApp = () => {
        setFileUploaded(false);
        setFileName('');
        setCsvData([]);
        setCurrentPage(1);
        setTableNames([]); // Clear all table names
    };

    const handleJoin = (commonColumn) => {
        if (tableNames.length < 2) {
            alert("You need at least two tables to perform a join operation.");
            return;
        }

        try {
            // Construct the join query using FULL OUTER JOIN
            const joinQuery = tableNames.reduce((query, tableName, index) => {
                const formattedTableName = `[${tableName}]`;
                if (index === 0) {
                    return `SELECT * FROM ${formattedTableName}`;
                } else {
                    return `${query} FULL OUTER JOIN ${formattedTableName} ON ${tableNames[0]}.${commonColumn} = ${tableName}.${commonColumn}`;
                }
            }, '');

            console.log("Join Query:", joinQuery);

            // Execute the join query
            const result = alasql(joinQuery);

            console.log(`Joined result: ${result.length} rows`);

            // Use "Joined_Data" as the table name
            const joinedTableName = "Joined_Data";
            
            // Create the AlaSQL table for joined data
            alasql(`DROP TABLE IF EXISTS [${joinedTableName}]`);
            alasql(`CREATE TABLE [${joinedTableName}]`);
            alasql(`SELECT * INTO [${joinedTableName}] FROM ?`, [result]);

            // Update columnNames with the new joined data structure
            const newColumnNames = Object.keys(result[0]);
            setColumnNames(newColumnNames);

            // Update the current data with the joined result
            setCurrentData(result);

            // Set the current file name to Joined_Data
            setFileName(joinedTableName);

            // Set isJoinedData to true
            setIsJoinedData(true);

            // Notify that a new table has been created
            handleTableCreated(joinedTableName);

            // Set the current page to 1
            setCurrentPage(1);

            console.log(`Joined data processed as new table: ${joinedTableName}`);
        } catch (error) {
            console.error('Error performing join operation:', error);
            alert(`Error performing join: ${error.message}`);
        }
    };

    const calculateCommonColumns = () => {
        const allTables = Object.keys(alasql.tables);
        if (allTables.length > 1) {
            let common = null;

            allTables.forEach((tableName, index) => {
                const tableColumns = alasql(`SHOW COLUMNS FROM [${tableName}]`).map(col => col.columnid);
                console.log(`Columns in ${tableName}:`, tableColumns);

                if (index === 0) {
                    common = new Set(tableColumns);
                } else {
                    common = new Set([...common].filter(x => tableColumns.includes(x)));
                }
            });

            const commonArray = Array.from(common);
            console.log('Common Columns across all tables:', commonArray);
            setCommonColumns(commonArray);
        } else {
            console.log('Not enough tables to find common columns.');
            setCommonColumns([]);
        }
    };

    const handleDataSourceChange = (e) => {
        const newDataSource = e.target.value;
        setDataSource(newDataSource);
        if (newDataSource === 'db') {
            fetchAvailableTables();
            setSelectedTable(''); // Reset selected table
        } else {
            // Reset states for CSV option
            setFileUploaded(false);
            setFileName('');
            setCurrentData([]);
            setColumnNames([]);
            setAvailableTables([]); // Clear available tables
            setSelectedTable(''); // Reset selected table
        }
    };

    const handleTableSelectionChange = (event) => {
        const selectedTableName = event.target.value;
        setSelectedTable(selectedTableName);
        console.log(`Selected table: ${selectedTableName}`); // Log the selected table
    };

    return (
        <div className="App">
            <div className="sidebar" style={{ width: '300px', position: 'fixed', left: 0, top: 0, bottom: 0, overflowY: 'auto' }}>
                <label>Select Data Source:</label>
                <select value={dataSource} onChange={handleDataSourceChange}>
                    <option value="csv">CSV File</option>
                    <option value="db">Database Table</option>
                </select>

                {dataSource === 'db' && availableTables.length > 0 && (
                    <div>
                        <label>Select Table:</label>
                        <select value={selectedTable} onChange={handleTableSelectionChange}>
                            <option value="">Select a table</option>
                            {availableTables.map((table) => (
                                <option key={table} value={table}>{table}</option>
                            ))}
                        </select>
                    </div>
                )}

                {(dataSource === 'csv' || (dataSource === 'db' && fileUploaded)) && (
                    <KPIUploader
                        onFileUpload={handleFileUpload}
                        onClearData={handleClearDataInApp}
                        onTableCreated={handleTableCreated}
                        onCommonColumnsChange={handleCommonColumnsChange}
                        currentData={currentData}
                        setCurrentData={setCurrentData}  // Make sure this line is present
                        columnNames={columnNames}
                        setColumnNames={setColumnNames}
                        fileName={fileName}
                        setFileName={setFileName}
                        dataSource={dataSource}
                        setIsJoinedData={setIsJoinedData}
                        setCurrentPage={setCurrentPage}
                        setIsDataLoaded={setIsDataLoaded}
                    />
                )}

                {tableNames.length > 0 && (
                    <div className="current-table">
                        <h3>Current Loaded Tables:</h3>
                        <ul>
                            {tableNames.map((name, index) => (
                                <li key={index}>
                                    <a href="#" onClick={() => handleTableClick(name)}>{name}</a>
                                    <button
                                        onClick={() => handleRemoveTable(name)}
                                        className="delete-button"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="content" style={{ marginLeft: '320px', padding: '20px' }}>
                {!isDataLoaded ? (
                    <div className="card">
                        <h2>Welcome to the KPI Uploader!</h2>
                        {dataSource === 'db' && <p>Loading data from database...</p>}
                    </div>
                ) : (
                    <div className="card">
                        <h2>Welcome to the KPI Uploader!</h2>
                        <p>File uploaded: <strong>{fileName}</strong></p>

                        {renderTable()}

                        <div>
                            <h3>Common Columns across all tables:</h3>
                            {commonColumns.length > 0 ? (
                                <ul>
                                    {commonColumns.map((column) => (
                                        <li key={column}>
                                            {column}
                                            <button 
                                                onClick={() => handleJoin(column)}
                                                style={{marginLeft: '10px'}}
                                            >
                                                Join on {column}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No common columns found.</p>
                            )}
                        </div>

                        <div className="Line_chart">
                            <Line data={generateChartData()} options={chartOptions} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App
