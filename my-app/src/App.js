import React, { useState, useEffect } from 'react';
import './KPIUploader.css';
import KPIUploader from './kpi-formula-parser';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function App() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileName, setFileName] = useState('');
    const [csvData, setCsvData] = useState([]);
    const [dbData, setDbData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState('csv');
    const rowsPerPage = 10;

    // Function to fetch data from the database
    const fetchDataFromDatabase = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/kpis');
            const data = await response.json();
            setDbData(data);
            setFileUploaded(true); // update statement
        } catch (error) {
            console.error('Error fetching KPI data from database:', error);
        }
    };

    // Effect to handle data source change
    useEffect(() => {
        if (dataSource === 'db') { // if user chooses database as data resource
            fetchDataFromDatabase();
        }
    }, [dataSource]);

    // Handle file upload and sending data to the database
    const handleFileUpload = async (uploadedfileName, parsedCsvData) => { // <-- Add 'async' here
        setFileUploaded(true);
        setFileName(uploadedfileName);
        setCsvData(parsedCsvData);
        setCurrentPage(1); // Reset to first page on new file upload

        try {
            const response = await fetch('http://localhost:5000/api/kpis', { // <-- await inside async
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedCsvData),
            });

            if (!response.ok) {
                throw new Error('Failed to upload CSV data to the database');
            }

            console.log('CSV data uploaded to the database successfully');
        } catch (error) {
            console.error('Error uploading CSV data to the database:', error);
        }
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
        const data = dataSource === 'csv' ? csvData : dbData;

        if (data.length === 0) return null;

        const headers = Object.keys(data[0]);
        const startIndex = (currentPage - 1) * rowsPerPage;
        const currentData = csvData.slice(startIndex, startIndex + rowsPerPage);

        return (
            <div>
                <table className="csv-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row, index) => (
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
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={startIndex + rowsPerPage >= csvData.length}>
                        Next
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            <div className="sidebar" style={{ width: fileUploaded ? '300px' : 'auto' }}>
                <label>Select Data Source:</label>
                <select value={dataSource} onChange={(e) => setDataSource(e.target.value)}>
                    <option value="csv">CSV File</option>
                    <option value="db">Database Table</option>
                </select>

                {dataSource === 'csv' && <KPIUploader onFileUpload={handleFileUpload} />}
            </div>

            <div className="content">
                {!fileUploaded ? (
                    <div className="card">
                        <h2>Welcome to the KPI Uploader!</h2>
                    </div>
                ) : (
                    <div className="card">
                        <h2>Welcome to the KPI Uploader!</h2>
                        <p>File uploaded: <strong>{fileName}</strong></p>

                        {renderTable()}

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

export default App;
