import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function Home() {
  const { t } = useTranslation();
  const [csvData, setCsvData] = useState(null);
  const [columnNames, setColumnNames] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [kpiValues, setKpiValues] = useState({});
  const [calculationExpression, setCalculationExpression] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [useDefaultCSV, setUseDefaultCSV] = useState(false);
  const [filters, setFilters] = useState({});
  const [customFormula, setCustomFormula] = useState('');
  const [savedFormulas, setSavedFormulas] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseCSVFile(file);
    }
  };

  const parseCSVFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        const columns = Object.keys(result.data[0]).filter(col => col);
        setCsvData(result.data);
        setColumnNames(columns);
      },
    });
  };

  useEffect(() => {
    const formulas = JSON.parse(localStorage.getItem('savedFormulas')) || [];
    setSavedFormulas(formulas);
  }, []);

  const calculateKPI = (column) => {
    const values = csvData
      .filter((row) => applyFilter(row))
      .map((row) => parseFloat(row[column]))
      .filter((val) => !isNaN(val));

    if (values.length === 0) {
      return { min: 'N/A', max: 'N/A', avg: 'N/A', sum: 'N/A' };
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = sum / values.length || 0;

    return { min, max, avg, sum };
  };

  const applyFilter = (row) => {
    for (let column in filters) {
      const filterValue = filters[column];
      if (filterValue && !String(row[column]).includes(filterValue)) {
        return false;
      }
    }
    return true;
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

  const handleCustomFormulaChange = (e) => {
    setCustomFormula(e.target.value);
  };

  const saveCustomFormula = () => {
    const updatedFormulas = [...savedFormulas, customFormula];
    setSavedFormulas(updatedFormulas);
    localStorage.setItem('savedFormulas', JSON.stringify(updatedFormulas));
    setCustomFormula(''); // 清空输入框
  };

  const handleUseSavedFormula = (formula) => {
    setCalculationExpression(formula);
  };

  const handleFilterChange = (column, value) => {
    setFilters({ ...filters, [column]: value });
  };

  const handleKPISelect = (column, kpi) => {
    const expressionPart = `${column}.${kpi}`;
    setCalculationExpression((prev) => prev + (prev.length ? ' ' : '') + expressionPart);
  };

  const handleCalculation = () => {
    try {
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
    } catch (error) {
      setCalculationResult('Error in calculation: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-lg shadow-lg">
      <h2 className="text-5xl font-extrabold text-gray-900 text-center mb-8">{t('CSV KPI Uploader')}</h2>

      {/* 使用默认 CSV 文件 */}
      <div className="mb-6 flex justify-center items-center">
        <label htmlFor="defaultCSV" className="block text-2xl font-medium text-gray-700">{t('Use Default CSV File')}</label>
        <input
          type="checkbox"
          id="defaultCSV"
          className="ml-4 h-8 w-8 text-blue-600 rounded-md focus:ring-2 focus:ring-blue-500"
          checked={useDefaultCSV}
          onChange={() => setUseDefaultCSV(!useDefaultCSV)}
        />
      </div>

      {!useDefaultCSV && (
        <div className="mb-6 flex flex-col items-center">
          <label htmlFor="formFile" className="block text-2xl font-medium text-gray-700 mb-2">{t('Upload CSV File')}</label>
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('Select Columns for KPI Calculation')}:</h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {columnNames.map((column) => (
              <div key={column} className="flex flex-col bg-white shadow-md p-4 rounded-lg hover:bg-gray-50 transition-transform duration-300 ease-in-out transform hover:scale-105">
                <input
                  type="checkbox"
                  id={column}
                  name={column}
                  value={column}
                  onChange={() => handleColumnSelection(column)}
                  className="mr-4 h-6 w-6 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded-md"
                />
                <label htmlFor={column} className="mr-4 text-lg text-gray-700">{column}</label>
                {/* 输入框用于过滤 */}
                <input
                  type="text"
                  placeholder={t('Filter data')}
                  onChange={(e) => handleFilterChange(column, e.target.value)}
                  className="p-2 mt-2 border border-gray-300 rounded-md"
                />
                <select
                  onChange={(e) => handleKPISelect(column, e.target.value)}
                  defaultValue=""
                  className="p-2 border border-gray-300 rounded-md text-lg bg-gray-50 hover:bg-gray-100 transition-all mt-2"
                >
                  <option value="" disabled>{t('Select Value')}</option>
                  <option value="min">{t('Min')}</option>
                  <option value="max">{t('Max')}</option>
                  <option value="avg">{t('Avg')}</option>
                  <option value="sum">{t('Sum')}</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 自定义公式输入框 */}
      <div className="my-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('Custom KPI Formula')}</h3>
        <input
          type="text"
          value={customFormula}
          onChange={handleCustomFormulaChange}
          className="w-full p-3 border border-gray-400 rounded-lg text-lg"
          placeholder={t('Enter your custom formula')}
        />
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4 text-lg hover:bg-green-600 transition-all duration-200"
          onClick={saveCustomFormula}
        >
          {t('Save Formula')}
        </button>
      </div>


      <div className="my-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('Use Saved Formula')}</h3>
        <select
          onChange={(e) => handleUseSavedFormula(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg text-lg bg-gray-50"
        >
          <option value="">{t('Select a saved formula')}</option>
          {savedFormulas.map((formula, index) => (
            <option key={index} value={formula}>{formula}</option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full p-4 border border-gray-400 rounded-lg text-lg text-gray-700 bg-white shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        rows="4"
        value={calculationExpression}
        placeholder={t('e.g. column1.sum + column2.avg')}
        onChange={(e) => setCalculationExpression(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 text-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 w-full max-w-sm mx-auto block shadow-md"
        onClick={handleCalculation}
      >
        {t('Calculate')}
      </button>

      {calculationResult !== null && (
        <div className="mt-6 p-4 bg-gray-100 text-gray-800 rounded-lg text-lg shadow-md">
          <h4 className="font-bold text-xl">{t('Calculation Result')}</h4>
          <p>{calculationResult}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
