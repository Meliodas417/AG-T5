import React, { useState } from 'react';
import './KPIUploader.css';
import KPIUploader from './kpi-formula-parser';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function App() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileName, setFileName] = useState('');
    const [csvData, setCsvData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const handleFileUpload = (uploadedfileName, parsedCsvData) => {
        setFileUploaded(true);
        setFileName(uploadedfileName);
        setCsvData(parsedCsvData);
        setCurrentPage(1); // Reset to first page on new file upload
    };

    const generateChartData = () => {
        console.log("CSV Data:", csvData);
        const labels = csvData.map((row) => row['Timestamp']);
        const dataValues = csvData.map((row) => row['Signal_Strength']);

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
        const labels = csvData.map((row) => row['Application_Type']);
        const dataValues = csvData.map((row) => row['Resource_Allocation']);

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

    const renderCsvTable = () => {
        if (csvData.length === 0) return null;

        const headers = Object.keys(csvData[0]);
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
                <KPIUploader onFileUpload={handleFileUpload} />
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

                        {renderCsvTable()}

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
