import React, { useState } from 'react';
import axios from 'axios';

function APIData() {
  const [apiData, setApiData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users'); // 示例 API
      setApiData(response.data);
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">API Data Import</h2>
      <div className="flex justify-center">
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 text-lg hover:bg-blue-700 transition-all duration-200"
        >
          Fetch API Data
        </button>
      </div>

      {apiData && (
        <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Fetched API Data</h3>
          <pre className="text-gray-600 text-sm">{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default APIData;
