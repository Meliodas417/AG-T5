import React, { useState } from 'react';
import './KPIUploader.css';
import KPIUploader from './kpi-formula-parser';

function App() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (uploadedfileName) => {
        setFileUploaded(true);
        setFileName(uploadedfileName); 
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
                    </div>
                )}
            </div>
        </div>
    );
} 

export default App;
