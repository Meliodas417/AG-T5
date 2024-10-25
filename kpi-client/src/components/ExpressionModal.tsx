import { useState } from 'react'

interface ExpressionModalProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onApply: (expression: Expression) => void
}

export interface Expression {
  name: string
  expression: string
  sourceTable: string
  sourceColumn: string
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'concat' | 'custom'
  targetTable: string
  targetColumn: string
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

  const handleApply = () => {
    onApply(expression)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-night/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-night mb-4">Create Expression</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Expression Name"
            value={expression.name}
            onChange={(e) => setExpression({ ...expression, name: e.target.value })}
            className="w-full p-2 border border-celtic-blue/20 rounded-lg"
          />

          <select
            value={expression.operation}
            onChange={(e) => setExpression({ ...expression, operation: e.target.value as Expression['operation'] })}
            className="w-full p-2 border border-celtic-blue/20 rounded-lg"
          >
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (-)</option>
            <option value="multiply">Multiply (×)</option>
            <option value="divide">Divide (÷)</option>
            <option value="concat">Concatenate</option>
            <option value="custom">Custom Expression</option>
          </select>

          {expression.operation === 'custom' ? (
            <textarea
              placeholder="Enter custom expression (e.g., [Table1].[Column1] * 2 + [Table2].[Column2])"
              value={expression.expression}
              onChange={(e) => setExpression({ ...expression, expression: e.target.value })}
              className="w-full p-2 border border-celtic-blue/20 rounded-lg h-24 font-mono text-sm"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    value={expression.sourceTable}
                    onChange={(e) => setExpression({ ...expression, sourceTable: e.target.value })}
                    className="w-full p-2 border border-celtic-blue/20 rounded-lg"
                  >
                    <option value="">Source Table</option>
                    {history.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={expression.sourceColumn}
                    onChange={(e) => setExpression({ ...expression, sourceColumn: e.target.value })}
                    className="w-full p-2 border border-celtic-blue/20 rounded-lg"
                  >
                    <option value="">Source Column</option>
                    {history.find(item => item.id === expression.sourceTable)?.headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    value={expression.targetTable}
                    onChange={(e) => setExpression({ ...expression, targetTable: e.target.value })}
                    className="w-full p-2 border border-celtic-blue/20 rounded-lg"
                  >
                    <option value="">Target Table</option>
                    {history.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={expression.targetColumn}
                    onChange={(e) => setExpression({ ...expression, targetColumn: e.target.value })}
                    className="w-full p-2 border border-celtic-blue/20 rounded-lg"
                  >
                    <option value="">Target Column</option>
                    {history.find(item => item.id === expression.targetTable)?.headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-night hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!expression.name || (expression.operation === 'custom' ? !expression.expression : (!expression.sourceTable || !expression.sourceColumn || !expression.targetTable || !expression.targetColumn))}
              className="bg-celtic-blue text-snow px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
