export interface HistoryItem {
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

export interface JoinConfig {
  leftTable: string
  rightTable: string
  leftColumn: string
  rightColumn: string
  type: 'inner' | 'left' | 'right' | 'full'
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