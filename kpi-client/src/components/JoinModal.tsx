import { useState } from 'react'
import type { JoinConfig, HistoryItem } from '../types'

interface JoinModalProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onJoin: (config: JoinConfig) => void
}

const JoinModal = ({ isOpen, onClose, history, onJoin }: JoinModalProps) => {
  const [config, setConfig] = useState<JoinConfig>({
    leftTable: '',
    rightTable: '',
    leftColumn: '',
    rightColumn: '',
    type: 'inner'
  })

  const handleJoin = () => {
    onJoin(config)
    onClose()
  }

  if (!isOpen) return null

  const joinTypeDescriptions = {
    inner: 'Returns only the matching rows from both tables',
    left: 'Returns all rows from the left table and matching rows from the right table',
    right: 'Returns all rows from the right table and matching rows from the left table',
    full: 'Returns all rows from both tables with matching records where available'
  }

  return (
    <div className="fixed inset-0 bg-night/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-night mb-6">Join Tables</h2>
        
        <div className="space-y-6">
          {/* Join Type Selection with Visual Aid */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-night mb-3">Join Type</label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(joinTypeDescriptions).map(([type, description]) => (
                <button
                  key={type}
                  onClick={() => setConfig({ ...config, type: type as JoinConfig['type'] })}
                  className={`p-4 rounded-lg border-2 transition-all text-left space-y-2
                    ${config.type === type 
                      ? 'border-celtic-blue bg-celtic-blue/5' 
                      : 'border-night/10 hover:border-celtic-blue/50'}`}
                >
                  <div className="font-medium capitalize">{type} Join</div>
                  <div className="text-xs text-night/60">{description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Table Selection Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Table Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-night">Left Table</label>
                <select
                  value={config.leftTable}
                  onChange={(e) => setConfig({ ...config, leftTable: e.target.value, leftColumn: '' })}
                  className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                >
                  <option value="">Select Table</option>
                  {history.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-night">Join Column</label>
                <select
                  value={config.leftColumn}
                  onChange={(e) => setConfig({ ...config, leftColumn: e.target.value })}
                  className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                  disabled={!config.leftTable}
                >
                  <option value="">Select Column</option>
                  {history.find(item => item.id === config.leftTable)?.headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Table Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-night">Right Table</label>
                <select
                  value={config.rightTable}
                  onChange={(e) => setConfig({ ...config, rightTable: e.target.value, rightColumn: '' })}
                  className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                >
                  <option value="">Select Table</option>
                  {history.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-night">Join Column</label>
                <select
                  value={config.rightColumn}
                  onChange={(e) => setConfig({ ...config, rightColumn: e.target.value })}
                  className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                  disabled={!config.rightTable}
                >
                  <option value="">Select Column</option>
                  {history.find(item => item.id === config.rightTable)?.headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-night/10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-night hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={!config.leftTable || !config.rightTable || !config.leftColumn || !config.rightColumn}
              className="bg-celtic-blue text-snow px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Tables
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinModal
