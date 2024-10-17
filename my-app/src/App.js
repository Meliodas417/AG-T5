import React, { useState, useEffect } from 'react';
import './KPIUploader.css';
import KPIUploader from './kpi-formula-parser';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import alasql from 'alasql';

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

    // Function to handle when a new table is created
    const handleTableCreated = (tableName) => {
        setTableNames((prevTableNames) => {
            if (!prevTableNames.includes(tableName)) {
                return [...prevTableNames, tableName];
            }
            return prevTableNames;
        });
    };

    // Function to fetch data from the database
    const fetchDataFromDatabase = async () => {
        console.log('Attempting to fetch data from database...');
        try {
            console.log('Sending request to http://localhost:8001/api/kpis');
            const response = await fetch('http://localhost:8001/api/kpis', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            console.log('Response received:', response);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            setDbData(data);
            setFileUploaded(true);

            // Create an AlaSQL table and insert DB data
            alasql('DROP TABLE IF EXISTS dbData');
            alasql('CREATE TABLE dbData');
            alasql('INSERT INTO dbData SELECT * FROM ?', [data]);
            console.log('Data inserted into AlaSQL table');
        } catch (error) {
            console.error('Error fetching KPI data from database:', error);
            console.error('Error details:', error.message);
            // Optionally, set an error state here to display to the user
        }
    };

    // Effect to handle data source change
    useEffect(() => {
        if (dataSource === 'db') { // if user chooses database as data resource
            fetchDataFromDatabase();
        }
    }, [dataSource]);

    // Example SQL operation: Join CSV and DB data
    const performJoinOperation = () => {
        try {
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

    // Handle file upload and sending data to the database
    const handleFileUpload = (uploadedFileName, data, columns = null) => {
        setFileUploaded(true);
        setFileName(uploadedFileName);
        setCsvData(data);
        setCurrentData(data);
        setColumnNames(columns || Object.keys(data[0]));
        setIsJoinedData(uploadedFileName.startsWith("Joined_Data"));
        setCurrentPage(1);

        const tableName = uploadedFileName.replace(/\.[^/.]+$/, "");
        
        alasql(`DROP TABLE IF EXISTS ${tableName}`);
        alasql(`CREATE TABLE ${tableName} (${Object.keys(data[0]).map(col => `[${col}] STRING`).join(', ')})`);
        alasql(`INSERT INTO ${tableName} SELECT * FROM ?`, [data]);

        calculateCommonColumns();
    };

    const handleCommonColumnsChange = (columns) => {
        setCommonColumns(columns);
    };

    const generateChartData = () => {
        const data = dataSource === 'csv' ? csvData : dbData;
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

    const generatePieChartData = () => {
        const data = dataSource === 'csv' ? csvData : dbData;
        const labels = data.map((row) => row['Application_Type']);
        const dataValues = data.map((row) => row['Resource_Allocation']);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Resource Allocation by Application Type',
                    data: dataValues,
                    backgroundColor: [
                        '#FF6666',
                        '#99CCCC',
                        '#99CC33',
                        '#336699',
                        '#FF9966',
                        '#FFCCCC',
                    ],
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

    const renderTable = () => {
        const data = isJoinedData ? currentData : (dataSource === 'csv' ? csvData : dbData);

        if (data.length === 0) return null;

        // Get the original column order
        const originalHeaders = Object.keys(data[0]);
        
        // Use columnNames if available, otherwise use originalHeaders
        const headers = columnNames && columnNames.length > 0 ? columnNames : originalHeaders;

        const startIndex = (currentPage - 1) * rowsPerPage;
        const pageData = data.slice(startIndex, startIndex + rowsPerPage);

        return (
            <div>
                <h3>{isJoinedData ? 'Joined Data Table' : 'Original Data Table'}</h3>
                <table className="csv-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((row, index) => (
                            <tr key={index}>
                                {headers.map((header) => (
                                    <td key={header}>{row[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={startIndex + rowsPerPage >= data.length}>
                        Next
                    </button>
                </div>
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
            // Construct the join query
            const joinQuery = tableNames.reduce((query, tableName, index) => {
                const formattedTableName = `[${tableName}]`;
                if (index === 0) {
                    return `SELECT * FROM ${formattedTableName}`;
                } else {
                    return `${query} INNER JOIN ${formattedTableName} ON ${tableNames[0]}.${commonColumn} = ${tableName}.${commonColumn}`;
                }
            }, '');

            console.log("Join Query:", joinQuery);

            // Execute the join query
            const result = alasql(`SELECT DISTINCT * FROM (${joinQuery})`);

            console.log(`Joined result: ${result.length} rows`);

            const tempTableName = 'temp_joined_table';
            alasql(`DROP TABLE IF EXISTS ${tempTableName}`);
            alasql(`CREATE TABLE ${tempTableName}`);
            alasql(`SELECT * INTO ${tempTableName} FROM ?`, [result]);

            // Update columnNames with the new joined data structure
            const newColumnNames = Object.keys(result[0]);
            setColumnNames(newColumnNames);

            // Simulate file upload with joined data
            const joinedFileName = "Joined_Data.csv";
            handleFileUpload(joinedFileName, result, newColumnNames);

            console.log(`Joined data processed as new CSV: ${joinedFileName}`);
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
            setCommonColumns(commonArray);
        } else {
            console.log('Not enough tables to find common columns.');
            setCommonColumns([]);
        }
    };

    return (
        <div className="App">
            <div className="sidebar" style={{ width: '300px', position: 'fixed', left: 0, top: 0, bottom: 0, overflowY: 'auto' }}>
                <label>Select Data Source:</label>
                <select value={dataSource} onChange={(e) => setDataSource(e.target.value)}>
                    <option value="csv">CSV File</option>
                    <option value="db">Database Table</option>
                </select>

                {dataSource === 'csv' && (
                    <KPIUploader
                        onFileUpload={handleFileUpload}
                        onClearData={handleClearDataInApp}
                        onTableCreated={handleTableCreated}
                        onCommonColumnsChange={handleCommonColumnsChange}
                        currentData={currentData}
                        columnNames={columnNames}
                        setColumnNames={setColumnNames}
                    />
                )}

                {tableNames.length > 0 && (
                    <div className="current-table">
                        <h3>Current Loaded Tables:</h3>
                        <ul>
                            {tableNames.map((name, index) => (
                                <li key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="content" style={{ marginLeft: '320px', padding: '20px' }}>
                {!fileUploaded ? (
                    <div className="card">
                        <h2>Welcome to the KPI Uploader!</h2>
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

                        <div className="Doughnut_chart">
                            <Doughnut data={generatePieChartData()} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App
