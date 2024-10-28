import { useState } from 'react'
import type { Expression, HistoryItem } from '../types'

interface ExpressionModalProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onApply: (expression: Expression) => void
}

const ExpressionModal = ({ isOpen, onClose, history, onApply }: ExpressionModalProps) => {
  const [expression, setExpression] = useState<Expression>({
    name: '',
    expression: '',
    sourceTable: '',
    sourceColumn: '',
    operation: 'add',
    targetTable: '',
    targetColumn: ''
  })

  const operationIcons = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷',
    concat: '⊕',
    custom: '𝑓(x)'
  }

  const operationDescriptions: Record<Expression['operation'], string> = {
    add: 'Add values from the source column',
    subtract: 'Subtract values from the source column',
    multiply: 'Multiply values by the source column',
    divide: 'Divide values by the source column',
    concat: 'Concatenate text with the source column',
    custom: 'Write a custom expression'
  }

  const handleApply = () => {
    onApply(expression)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-night/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-night mb-6">Create Expression</h2>
        
        <div className="space-y-6">
          {/* Expression Name */}
          <div>
            <label className="block text-sm font-medium text-night mb-2">Expression Name</label>
            <input
              type="text"
              placeholder="e.g., Calculate Total Sales"
              value={expression.name}
              onChange={(e) => setExpression({ ...expression, name: e.target.value })}
              className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
            />
          </div>

          {/* Operation Selection */}
          <div>
            <label className="block text-sm font-medium text-night mb-3">Operation Type</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(operationIcons).map(([op, icon]) => (
                <button
                  key={op}
                  onClick={() => setExpression({ ...expression, operation: op as Expression['operation'] })}
                  className={`p-4 rounded-lg border-2 transition-all text-left space-y-2
                    ${expression.operation === op 
                      ? 'border-celtic-blue bg-celtic-blue/5' 
                      : 'border-night/10 hover:border-celtic-blue/50'}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-medium">{icon}</span>
                    <span className="font-medium capitalize">{op}</span>
                  </div>
                  <div className="text-xs text-night/60">
                    {operationDescriptions[op as Expression['operation']]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {expression.operation === 'custom' ? (
            <div>
              <label className="block text-sm font-medium text-night mb-2">Custom Expression</label>
              <div className="relative">
                <textarea
                  placeholder="Enter your expression using column references like [Table].[Column]"
                  value={expression.expression}
                  onChange={(e) => setExpression({ ...expression, expression: e.target.value })}
                  className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30 font-mono text-sm h-32"
                />
           
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-night">Source</h3>
                <div className="space-y-3">
                  <select
                    value={expression.sourceTable}
                    onChange={(e) => setExpression({ ...expression, sourceTable: e.target.value, sourceColumn: '' })}
                    className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                  >
                    <option value="">Select Source Table</option>
                    {history.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <select
                    value={expression.sourceColumn}
                    onChange={(e) => setExpression({ ...expression, sourceColumn: e.target.value })}
                    className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                    disabled={!expression.sourceTable}
                  >
                    <option value="">Select Source Column</option>
                    {history.find(item => item.id === expression.sourceTable)?.headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-night">Target</h3>
                <div className="space-y-3">
                  <select
                    value={expression.targetTable}
                    onChange={(e) => setExpression({ ...expression, targetTable: e.target.value, targetColumn: '' })}
                    className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                  >
                    <option value="">Select Target Table</option>
                    {history.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <select
                    value={expression.targetColumn}
                    onChange={(e) => setExpression({ ...expression, targetColumn: e.target.value })}
                    className="w-full p-3 border border-night/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue/30"
                    disabled={!expression.targetTable}
                  >
                    <option value="">Select Target Column</option>
                    {history.find(item => item.id === expression.targetTable)?.headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-night/10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-night hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!expression.name || (expression.operation === 'custom' ? !expression.expression : (!expression.sourceTable || !expression.sourceColumn || !expression.targetTable || !expression.targetColumn))}
              className="bg-celtic-blue text-snow px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Expression
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpressionModal
