import React, { useState, useEffect } from 'react';

function KPIHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('kpiHistory')) || [];
    setHistory(storedHistory);
  }, []);

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">KPI History</h2>
      <ul className="list-disc pl-5">
        {history.length > 0 ? (
          history.map((entry, index) => (
            <li key={index} className="mb-4 text-lg text-gray-700">
              <strong>Expression:</strong> {entry.expression} | <strong>Result:</strong> {entry.result}
            </li>
          ))
        ) : (
          <p className="text-lg text-gray-600">No history found.</p>
        )}
      </ul>
    </div>
  );
}

export default KPIHistory;
