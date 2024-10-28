import { useState } from 'react'

type DataTableProps = {
  headers: string[]
  data: string[][]
  onUpdateCell: (rowIndex: number, colIndex: number, value: string) => void
  onExport: () => void
}

const DataTable = ({ headers, data, onUpdateCell, onExport }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter(row =>
    row.some(cell =>
      cell.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-snow p-4 rounded-lg shadow-sm border border-night/5">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30 text-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-night/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={onExport}
          className="ml-4 border border-celtic-blue text-celtic-blue px-4 py-2 rounded-lg hover:bg-celtic-blue/10 transition-all flex items-center space-x-2 text-sm font-medium"
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
              <tr className="bg-celtic-blue/5 border-b border-night/5">
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left text-sm font-medium text-night">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
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
