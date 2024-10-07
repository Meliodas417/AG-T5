import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import { useTable } from 'react-table';  // 引入 react-table

function KPIUploader() {
  const [csvData, setCsvData] = useState(null);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [kpiValues, setKpiValues] = useState({});
  const [calculationExpression, setCalculationExpression] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [useDefaultCSV, setUseDefaultCSV] = useState(false);
  const [history, setHistory] = useState([]); // 用于保存历史记录

  // 从 localStorage 加载历史记录
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('kpiHistory')) || [];
    setHistory(storedHistory);
  }, []);

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseCSVFile(file);
    }
  };

  // 解析 CSV 文件
  const parseCSVFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,  // 跳过空行
      dynamicTyping: true,   // 自动检测数据类型
      complete: (result) => {
        const columns = Object.keys(result.data[0]).filter(col => col); // 过滤掉空列
        setCsvData(result.data); // 设置解析后的数据
        setColumnNames(columns); // 设置列名
      },
    });
  };

  // 使用 react-table 展示 CSV 数据
  const columns = useMemo(() => columnNames.map((col) => ({ Header: col, accessor: col })), [columnNames]);
  const data = useMemo(() => csvData || [], [csvData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  const handleUseDefaultCSV = () => {
    setUseDefaultCSV(!useDefaultCSV);
    if (!useDefaultCSV) {
      fetchDefaultCSV();
    } else {
      setCsvData(null);
      setColumnNames([]);
    }
  };

  const fetchDefaultCSV = () => {
    const defaultCSV = `
KPI Name,Value,Target,Date
Revenue,50000,60000,2024-01-01
Customer Satisfaction,85,90,2024-01-01
Employee Retention,95,100,2024-01-01
Operating Costs,30000,25000,2024-01-01
Revenue,60000,60000,2024-02-01
Customer Satisfaction,87,90,2024-02-01
Employee Retention,96,100,2024-02-01
Operating Costs,28000,25000,2024-02-01
    `;

    const blob = new Blob([defaultCSV], { type: 'text/csv' });
    const file = new File([blob], 'default.csv', { type: 'text/csv' });
    parseCSVFile(file);
  };

  const calculateKPI = (column) => {
    const values = csvData
      .map((row) => parseFloat(row[column]))
      .filter((val) => !isNaN(val)); // 过滤非数字值

    if (values.length === 0) {
      return { min: 'N/A', max: 'N/A', avg: 'N/A', sum: 'N/A' };
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = sum / values.length || 0;

    return { min, max, avg, sum };
  };

  const handleColumnSelection = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
      const { [column]: _, ...rest } = kpiValues;
      setKpiValues(rest);
    } else {
      const kpiForColumn = calculateKPI(column);
      setSelectedColumns([...selectedColumns, column]);
      setKpiValues({
        ...kpiValues,
        [column]: kpiForColumn,
      });
    }
  };

  const handleKPISelect = (column, kpi) => {
    const expressionPart = `${column}.${kpi}`;
    setCalculationExpression((prev) => prev + (prev.length ? ' ' : '') + expressionPart);
  };

  const handleCalculation = () => {
    try {
      if (!calculationExpression.match(/^[a-zA-Z0-9_]+\.(min|max|avg|sum)(\s*[\+\-\*\/]\s*[a-zA-Z0-9_]+\.(min|max|avg|sum))*$/)) {
        throw new Error("Invalid calculation expression format");
      }

      const evaluatedExpression = calculationExpression.replace(
        /([a-zA-Z0-9_]+)\.(min|max|avg|sum)/g,
        (match, col, kpi) => {
          const value = kpiValues[col]?.[kpi];
          if (value === 'N/A' || value === undefined) {
            throw new Error(`KPI value for ${col}.${kpi} is not a number`);
          }
          return value;
        }
      );

      const result = eval(evaluatedExpression);
      setCalculationResult(result);

      // 保存历史记录
      const newHistory = [...history, { expression: calculationExpression, result }];
      setHistory(newHistory);
      localStorage.setItem('kpiHistory', JSON.stringify(newHistory));
    } catch (error) {
      setCalculationResult('Error in calculation: ' + error.message);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Column', 'Min', 'Max', 'Avg', 'Sum'],
      ...selectedColumns.map((column) => [
        column,
        kpiValues[column]?.min || 'N/A',
        kpiValues[column]?.max || 'N/A',
        kpiValues[column]?.avg || 'N/A',
        kpiValues[column]?.sum || 'N/A',
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "kpi_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">CSV KPI Uploader</h2>

      <div className="mb-6 flex justify-center items-center">
        <label htmlFor="defaultCSV" className="block text-xl font-medium text-gray-700">Use Default CSV File</label>
        <input
          type="checkbox"
          id="defaultCSV"
          className="ml-4 h-6 w-6 text-blue-600 rounded-md focus:ring-2 focus:ring-blue-500"
          checked={useDefaultCSV}
          onChange={handleUseDefaultCSV}
        />
      </div>

      {!useDefaultCSV && (
        <div className="mb-6 flex flex-col items-center">
          <label htmlFor="formFile" className="block text-xl font-medium text-gray-700 mb-2">Upload CSV File</label>
          <input
            className="mt-2 p-3 border border-gray-400 rounded-lg w-full max-w-lg text-center text-lg text-gray-600 cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {columnNames.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Columns for KPI Calculation:</h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {columnNames.map((column) => (
              <div key={column} className="flex items-center bg-white shadow-sm p-4 rounded-lg">
                <input
                  type="checkbox"
                  id={column}
                  name={column}
                  value={column}
                  onChange={() => handleColumnSelection(column)}
                  className="mr-4 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor={column} className="mr-4 text-lg text-gray-700">{column}</label>
                <select
                  onChange={(e) => handleKPISelect(column, e.target.value)}
                  defaultValue=""
                  className="p-2 border border-gray-300 rounded-md text-lg bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <option value="" disabled>Select Value</option>
                  <option value="min">Min</option>
                  <option value="max">Max</option>
                  <option value="avg">Avg</option>
                  <option value="sum">Sum</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <textarea
          className="w-full p-4 border border-gray-400 rounded-lg text-lg text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={calculationExpression}
          placeholder="e.g. column1.sum + column2.avg"
          onChange={(e) => setCalculationExpression(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 text-lg hover:bg-blue-700 transition-all duration-200 w-full max-w-sm mx-auto block shadow-md"
          onClick={handleCalculation}
        >
          Calculate
        </button>
        {calculationResult !== null && (
          <div className="mt-6 p-4 bg-gray-100 text-gray-800 rounded-lg text-lg shadow-md">
            <h4 className="font-bold text-xl">Calculation Result:</h4>
            <p>{calculationResult}</p>
          </div>
        )}
      </div>

      {/* 显示历史记录 */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">KPI Calculation History</h3>
        <ul className="list-disc pl-5">
          {history.map((entry, index) => (
            <li key={index} className="mb-2">
              Expression: {entry.expression} | Result: {entry.result}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg mt-8 text-lg hover:bg-green-700 transition-all duration-200 w-full max-w-sm mx-auto block shadow-md"
        onClick={handleExportCSV}
      >
        Export KPI Results to CSV
      </button>
    </div>
  );
}

export default KPIUploader;
