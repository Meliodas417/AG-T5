import { useState, ChangeEvent } from 'react'
import Papa from 'papaparse'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (type: 'csv' | 'database', data?: { headers: string[], data: string[][] }, connection?: string) => void
}

const ImportModal = ({ isOpen, onClose, onImport }: ImportModalProps) => {
  const [importType, setImportType] = useState<'csv' | 'database'>('csv')
  const [connectionString, setConnectionString] = useState('')
  const [error, setError] = useState('')

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
          onImport('csv', { headers, data })
          onClose()
        }
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`)
      }
    })
  }

  const handleDatabaseImport = async (connection: string) => {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connection }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data from database')
      }

      const result = await response.json()
      onImport('database', {
        headers: result.headers,
        data: result.data
      }, connection)
    } catch (error) {
      setError(error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-night/50 flex items-center justify-center">
      <div className="bg-snow p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-night mb-4">Import Data</h2>
        
        {error && (
          <div className="text-bittersweet mb-4">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-night mb-1">
              Import Type
            </label>
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value as 'csv' | 'database')}
              className="w-full p-2 border border-celtic-blue rounded-lg"
            >
              <option value="csv">CSV File</option>
              <option value="database">Database</option>
            </select>
          </div>

          {importType === 'database' && (
            <div>
              <label className="block text-sm font-medium text-night mb-1">
                Connection String
              </label>
              <input
                type="text"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                className="w-full p-2 border border-celtic-blue rounded-lg"
                placeholder="postgresql://user:password@localhost:5432/dbname"
              />
            </div>
          )}

          {importType === 'csv' && (
            <div>
              <label className="block text-sm font-medium text-night mb-1">
                CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full text-night
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-celtic-blue file:text-snow
                  hover:file:bg-opacity-90"
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
            {importType === 'database' && (
              <button
                onClick={() => onImport('database', undefined, connectionString)}
                className="bg-celtic-blue text-snow px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Import
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportModal
