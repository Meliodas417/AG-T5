import { useState } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import DataTable from './components/DataTable'
import ImportModal from './components/ImportModal'
import ExportModal from './components/ExportModal'
import ExpressionModal from './components/ExpressionModal'
import JoinModal from './components/JoinModal'
import type { HistoryItem, JoinConfig, Expression } from './types'

const App = () => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentData, setCurrentData] = useState<HistoryItem | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
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

    // Create filtered right headers (excluding the join column)
    const rightHeaders = rightTable.headers.filter((_, index) => index !== rightColIndex)

    // Create a map for quick lookup, excluding the join column from right table values
    const rightMap = new Map(
      rightTable.data.map(row => [
        row[rightColIndex],
        row.filter((_, index) => index !== rightColIndex)
      ])
    )

    let joinedData: string[][] = []

    // Perform the join based on the type
    switch (config.type) {
      case 'inner':
        joinedData = leftTable.data
          .filter(leftRow => rightMap.has(leftRow[leftColIndex]))
          .map(leftRow => [...leftRow, ...rightMap.get(leftRow[leftColIndex])!])
        break
      case 'left':
        joinedData = leftTable.data.map(leftRow => {
          const rightRow = rightMap.get(leftRow[leftColIndex])
          return [...leftRow, ...(rightRow || new Array(rightHeaders.length).fill(''))]
        })
        break
      case 'right':
        const leftMap = new Map(
          leftTable.data.map(row => [row[leftColIndex], row])
        )
        joinedData = rightTable.data.map(rightRow => {
          const leftRow = leftMap.get(rightRow[rightColIndex])
          const filteredRightRow = rightRow.filter((_, index) => index !== rightColIndex)
          return [...(leftRow || new Array(leftTable.headers.length).fill('')), ...filteredRightRow]
        })
        break
      case 'full':
        // Add all left rows first
        joinedData = leftTable.data.map(leftRow => {
          const rightRow = rightMap.get(leftRow[leftColIndex])
          return [...leftRow, ...(rightRow || new Array(rightHeaders.length).fill(''))]
        })
        // Add remaining right rows
        rightTable.data
          .filter(rightRow => !leftTable.data.some(leftRow => leftRow[leftColIndex] === rightRow[rightColIndex]))
          .forEach(rightRow => {
            const filteredRightRow = rightRow.filter((_, index) => index !== rightColIndex)
            joinedData.push([...new Array(leftTable.headers.length).fill(''), ...filteredRightRow])
          })
        break
    }

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      name: `Joined ${leftTable.name} & ${rightTable.name}`,
      timestamp: new Date(),
      type: 'csv',
      headers: [...leftTable.headers, ...rightHeaders],
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
            onJoinClick={() => setIsJoinModalOpen(true)}
            onExpressionClick={() => setIsExpressionModalOpen(true)}
            profile={{
              name: 'Nicolas Huang',
              email: 'nicolas.huang@utdallas.edu',
            }}
          />
        }
      >
        {currentData ? (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-night mb-6">{currentData.name}</h1>
            <DataTable
              headers={currentData.headers}
              data={currentData.data}
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

      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        history={history}
        onJoin={handleJoin}
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
