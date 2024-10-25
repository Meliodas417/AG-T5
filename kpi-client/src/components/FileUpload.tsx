import { useState, ChangeEvent } from 'react'
import Papa from 'papaparse'

interface CSVData {
  data: string[][]
  headers: string[]
}

const FileUpload = () => {
  const [csvData, setCSVData] = useState<CSVData | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError('')

    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    Papa.parse(file, {
      complete: (results) => {
        if (results.data && Array.isArray(results.data) && results.data.length > 0) {
          const headers = results.data[0] as string[]
          const data = results.data.slice(1) as string[][]
          setCSVData({ headers, data })
        }
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`)
      }
    })
  }

  return (
    <div className="bg-snow min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-night">CSV File Upload</h1>
        
        <div className="space-y-4">
          <label className="block">
            <span className="text-night">Upload CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-1 block w-full text-night
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-celtic-blue file:text-snow
                hover:file:bg-opacity-90"
            />
          </label>

          {error && (
            <div className="text-bittersweet">{error}</div>
          )}

          {csvData && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-celtic-blue text-snow">
                    {csvData.headers.map((header, index) => (
                      <th key={index} className="p-2 border text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-2 border">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload

