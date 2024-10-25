import { useState } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import DataTable from './components/DataTable'
import ImportModal from './components/ImportModal'
import MergeModal from './components/MergeModal'
import ExportModal from './components/ExportModal'
import ExpressionModal from './components/ExpressionModal'
import type { Expression } from './components/ExpressionModal'

interface HistoryItem {
  id: string
  name: string
  timestamp: Date
  type: 'csv' | 'database'
  headers: string[]
  data: string[][]
  source?: {
    type: 'database'
    connection: string
    query: string
  }
}

interface JoinConfig {
  leftTable: string
  rightTable: string
  leftColumn: string
  rightColumn: string
  type: 'inner' | 'left' | 'right' | 'full'
}

const App = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentData, setCurrentData] = useState<HistoryItem | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isExpressionModalOpen, setIsExpressionModalOpen] = useState(false)

  const handleImport = (type: 'csv' | 'database', data?: { headers: string[], data: string[][] }, connection?: string) => {
    if (type === 'csv' && data) {
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        name: `Import ${new Date().toLocaleString()}`,
        timestamp: new Date(),
        type: 'csv',
        headers: data.headers,
        data: data.data
      }
      setHistory([newItem, ...history])
      setCurrentData(newItem)
    } else if (type === 'database' && connection) {
      // Handle database connection here
      console.log('Database connection:', connection)
    }
    setIsImportModalOpen(false)
  }

  const handleAddColumn = (columnName: string) => {
    if (!currentData) return

    const newData = {
      ...currentData,
      headers: [...currentData.headers, columnName],
      data: currentData.data.map(row => [...row, ''])
    }
    setCurrentData(newData)
    setHistory(history.map(item => 
      item.id === currentData.id ? newData : item
    ))
  }

  const handleUpdateCell = (rowIndex: number, colIndex: number, value: string) => {
    if (!currentData) return

    const newData = {
      ...currentData,
      data: currentData.data.map((row, i) =>
        i === rowIndex
          ? row.map((cell, j) => j === colIndex ? value : cell)
          : row
      )
    }
    setCurrentData(newData)
    setHistory(history.map(item => 
      item.id === currentData.id ? newData : item
    ))
  }

  const handleMerge = (selectedItems: HistoryItem[]) => {
    if (selectedItems.length < 2) return

    // Use headers from the first item as the base
    const baseHeaders = selectedItems[0].headers
    
    // Initialize merged data with the first item's data
    let mergedData = selectedItems[0].data.map(row => [...row])
    
    // Merge data from subsequent items
    for (let i = 1; i < selectedItems.length; i++) {
      const currentItem = selectedItems[i]
      
      // For each row in the current dataset
      currentItem.data.forEach((currentRow, rowIndex) => {
        // If we need to add new rows to merged data
        if (rowIndex >= mergedData.length) {
          mergedData.push(new Array(baseHeaders.length).fill(''))
        }
        
        // For each cell in the current row
        currentRow.forEach((cell, colIndex) => {
          const baseCell = mergedData[rowIndex][colIndex]
          
          // Try to parse both values as numbers
          const num1 = parseFloat(baseCell)
          const num2 = parseFloat(cell)
          
          // If both are valid numbers, add them
          if (!isNaN(num1) && !isNaN(num2)) {
            mergedData[rowIndex][colIndex] = (num1 + num2).toString()
          } else {
            // If not numbers, concatenate as strings
            mergedData[rowIndex][colIndex] = baseCell 
              ? `${baseCell}${cell}` 
              : cell
          }
        })
      })
    }

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      name: `Merged ${new Date().toLocaleString()}`,
      timestamp: new Date(),
      type: 'csv',
      headers: baseHeaders,
      data: mergedData
    }

    setHistory([newItem, ...history])
    setCurrentData(newItem)
    setIsMergeModalOpen(false)
  }

  const handleExport = async (type: 'csv' | 'database', connection?: string) => {
    if (!currentData) return

    if (type === 'csv') {
      const headers = currentData.headers.join(',')
      const rows = currentData.data.map(row => row.join(','))
      const csvContent = [headers, ...rows].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentData.name}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } else if (type === 'database' && connection) {
      // Handle database export here
      console.log('Database export:', connection)
    }
    setIsExportModalOpen(false)
  }

  const handleExpression = (expression: Expression) => {
    if (!currentData) return

    const sourceTable = history.find(item => item.id === expression.sourceTable)
    const targetTable = history.find(item => item.id === expression.targetTable)

    if (!sourceTable || !targetTable) return

    const sourceColIndex = sourceTable.headers.indexOf(expression.sourceColumn)
    const targetColIndex = targetTable.headers.indexOf(expression.targetColumn)

    if (sourceColIndex === -1 || targetColIndex === -1) return

    const newData = currentData.data.map((row, rowIndex) => {
      const sourceValue = sourceTable.data[rowIndex]?.[sourceColIndex]
      const targetValue = targetTable.data[rowIndex]?.[targetColIndex]

      if (!sourceValue || !targetValue) return row

      let result: string
      switch (expression.operation) {
        case 'add':
          result = (parseFloat(sourceValue) + parseFloat(targetValue)).toString()
          break
        case 'subtract':
          result = (parseFloat(sourceValue) - parseFloat(targetValue)).toString()
          break
        case 'multiply':
          result = (parseFloat(sourceValue) * parseFloat(targetValue)).toString()
          break
        case 'divide':
          result = (parseFloat(sourceValue) / parseFloat(targetValue)).toString()
          break
        case 'concat':
          result = `${sourceValue}${targetValue}`
          break
        default:
          result = ''
      }

      return [...row, result]
    })

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      name: expression.name,
      timestamp: new Date(),
      type: 'csv',
      headers: [...currentData.headers, expression.name],
      data: newData
    }

    setHistory([newItem, ...history])
    setCurrentData(newItem)
  }

  const handleJoin = async (config: JoinConfig) => {
    const leftTable = history.find(item => item.id === config.leftTable)
    const rightTable = history.find(item => item.id === config.rightTable)

    if (!leftTable || !rightTable) return

    const leftColIndex = leftTable.headers.indexOf(config.leftColumn)
    const rightColIndex = rightTable.headers.indexOf(config.rightColumn)

    if (leftColIndex === -1 || rightColIndex === -1) return

    // Create a map for quick lookup
    const rightMap = new Map(
      rightTable.data.map(row => [row[rightColIndex], row])
    )

    let joinedData: string[][] = []

    // Perform the join based on the type
    switch (config.type) {
      case 'inner':
        joinedData = leftTable.data
          .filter(leftRow => rightMap.has(leftRow[leftColIndex]))
          .map(leftRow => [...leftRow, ...rightMap.get(leftRow[leftColIndex])!])
        break
      // Add other join types here
    }

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      name: `Joined ${leftTable.name} & ${rightTable.name}`,
      timestamp: new Date(),
      type: 'csv',
      headers: [...leftTable.headers, ...rightTable.headers],
      data: joinedData
    }

    setHistory([newItem, ...history])
    setCurrentData(newItem)
  }

  return (
    <>
      <Layout
        sidebar={
          <Sidebar
            history={history}
            onHistoryItemClick={setCurrentData}
            onImportClick={() => setIsImportModalOpen(true)}
            onMergeClick={() => setIsMergeModalOpen(true)}
            onExpressionClick={() => setIsExpressionModalOpen(true)}
          />
        }
      >
        {currentData ? (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-night mb-6">{currentData.name}</h1>
            <DataTable
              headers={currentData.headers}
              data={currentData.data}
              onAddColumn={handleAddColumn}
              onUpdateCell={handleUpdateCell}
              onExport={() => setIsExportModalOpen(true)}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-night/50">
            Select a dataset from history or import a new one
          </div>
        )}
      </Layout>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      <MergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        history={history}
        onMerge={handleMerge}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        currentData={currentData}
      />

      <ExpressionModal
        isOpen={isExpressionModalOpen}
        onClose={() => setIsExpressionModalOpen(false)}
        history={history}
        onApply={handleExpression}
      />
    </>
  )
}

export default App
