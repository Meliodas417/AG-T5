import { useState } from 'react'

interface HistoryItem {
  id: string
  name: string
  timestamp: Date
  type: 'csv' | 'database'
}

interface SidebarProps {
  history: HistoryItem[]
  onHistoryItemClick: (item: HistoryItem) => void
  onImportClick: () => void
  onMergeClick: () => void
  onExpressionClick: () => void
}

const Sidebar = ({ history, onHistoryItemClick, onImportClick, onMergeClick, onExpressionClick }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Logo and Name Section */}
      <div className="p-4 border-b border-night/10">
        <div className="flex items-center space-x-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-8 h-8 text-celtic-blue" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h1 className="text-xl font-bold text-night">KPI Tool</h1>
            <p className="text-xs text-night/60">Data Processing Tool</p>
          </div>
        </div>
      </div>

      {/* Existing Sidebar Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <button
            onClick={onImportClick}
            className="w-full px-4 py-2 bg-celtic-blue text-snow rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Import Data</span>
          </button>
          <button
            onClick={onMergeClick}
            className="w-full px-4 py-2 border border-celtic-blue text-celtic-blue rounded-lg hover:bg-celtic-blue/10 transition-all flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M6 11l-4 4 4 4" />
            </svg>
            <span>Merge Data</span>
          </button>
          <button
            onClick={onExpressionClick}
            className="w-full px-4 py-2 border border-celtic-blue text-celtic-blue rounded-lg hover:bg-celtic-blue/10 transition-all flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            <span>Create Expression</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-night/60">History</div>
          {history.map(item => (
            <button
              key={item.id}
              onClick={() => onHistoryItemClick(item)}
              className="w-full p-2 text-left hover:bg-celtic-blue/5 rounded-lg transition-all"
            >
              <div className="text-sm font-medium text-night">{item.name}</div>
              <div className="text-xs text-night/60">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
