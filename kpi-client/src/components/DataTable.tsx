import { useState } from 'react'

interface DataTableProps {
  headers: string[]
  data: string[][]
  onAddColumn: (columnName: string) => void
  onUpdateCell: (rowIndex: number, colIndex: number, value: string) => void
  onExport: () => void
}

const DataTable = ({ headers, data, onAddColumn, onUpdateCell, onExport }: DataTableProps) => {
  const [newColumnName, setNewColumnName] = useState('')

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      onAddColumn(newColumnName.trim())
      setNewColumnName('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-snow p-4 rounded-lg shadow-sm border border-night/5">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="New column name"
            className="px-4 py-2.5 bg-snow border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-bittersweet/30 text-sm"
          />
          <button
            onClick={handleAddColumn}
            className="border border-bittersweet text-bittersweet px-4 py-2.5 rounded-lg hover:bg-bittersweet/10 transition-all text-sm font-medium flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Column</span>
          </button>
        </div>
        
        <button
          onClick={onExport}
          className="border border-celtic-blue text-celtic-blue px-4 py-2.5 rounded-lg hover:bg-celtic-blue/10 transition-all flex items-center space-x-2 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export</span>
        </button>
      </div>

      <div className="overflow-hidden bg-snow rounded-lg shadow-sm border border-night/5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-night/[0.03] border-b border-night/10">
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left text-night/80 font-medium text-sm">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="border-b border-night/5 last:border-0 hover:bg-celtic-blue/[0.02] transition-colors"
                >
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="px-4 py-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => onUpdateCell(rowIndex, colIndex, e.target.value)}
                        className="w-full bg-transparent focus:outline-none focus:bg-bittersweet/5 rounded px-2 py-1.5 -mx-2 -my-1 text-sm transition-colors"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataTable
