import { useState } from 'react'

interface MergeModalProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onMerge: (selectedItems: HistoryItem[]) => void
}

const MergeModal = ({ isOpen, onClose, history, onMerge }: MergeModalProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedIds(newSelection)
  }

  const handleMerge = () => {
    const selectedItems = history.filter(item => selectedIds.has(item.id))
    onMerge(selectedItems)
    setSelectedIds(new Set())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-night/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-night mb-4">Merge CSVs</h2>
        
        <div className="space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-2">
            {history.map(item => (
              <label
                key={item.id}
                className="flex items-center space-x-3 p-2 hover:bg-celtic-blue/5 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="rounded border-celtic-blue/30 text-celtic-blue focus:ring-celtic-blue/30"
                />
                <div>
                  <div className="text-sm font-medium text-night">{item.name}</div>
                  <div className="text-xs text-night/60">
                    {item.headers.length} columns • {item.data.length} rows
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-night hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleMerge}
              disabled={selectedIds.size < 2}
              className="bg-celtic-blue text-snow px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Merge Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MergeModal

