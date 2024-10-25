import { useState } from 'react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (type: 'csv' | 'database', connection?: string) => void
  currentData: HistoryItem | null
}

const ExportModal = ({ isOpen, onClose, onExport, currentData }: ExportModalProps) => {
  const [exportType, setExportType] = useState<'csv' | 'database'>('csv')
  const [connectionString, setConnectionString] = useState('')

  if (!isOpen || !currentData) return null

  return (
    <div className="fixed inset-0 bg-night/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-night mb-4">Export Data</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-night mb-1">
              Export Type
            </label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as 'csv' | 'database')}
              className="w-full p-2 border border-celtic-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
            >
              <option value="csv">CSV File</option>
              <option value="database">Database</option>
            </select>
          </div>

          {exportType === 'database' && (
            <div>
              <label className="block text-sm font-medium text-night mb-1">
                Connection String
              </label>
              <input
                type="text"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                className="w-full p-2 border border-celtic-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                placeholder="postgresql://user:password@localhost:5432/dbname"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-night hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onExport(exportType, connectionString)}
              className="bg-celtic-blue text-snow px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal

