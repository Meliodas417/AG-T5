import React, { useState } from 'react';
import Papa from 'papaparse';

function Upload() {
  const [fileData, setFileData] = useState([]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    Array.from(files).forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setFileData((prevData) => [...prevData, result.data]);
        },
      });
    });
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Upload Multiple CSV Files</h2>
      <div className="mb-6 flex flex-col items-center">
        <label htmlFor="formFile" className="block text-xl font-medium text-gray-700 mb-4">Select CSV Files</label>
        <input
          className="p-4 border border-gray-400 rounded-lg text-center text-lg text-gray-600 cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200"
          type="file"
          multiple
          onChange={handleFileUpload}
        />
      </div>

      {fileData.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Data</h3>
          {fileData.map((data, index) => (
            <div key={index} className="p-4 mb-4 bg-white shadow-md rounded-lg">
              <h4 className="text-xl font-semibold text-gray-700">File {index + 1} Data</h4>
              <pre className="text-gray-600 text-sm">{JSON.stringify(data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Upload;
