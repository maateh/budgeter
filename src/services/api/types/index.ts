// pagination
export type Pagination<T> = {
  data: T[]
  offset: number
  nextPageOffset: number | null
  limit: number
  total: number
}

export type PaginationParams = {
  offset: number
  limit: number
}

// data models
export type Currencies = {
  [key: string]: string
}

export type Budget = {
  id: string
  name: string
  type: 'income' | 'expense'
  balance: {
    currency: string
    current: number
    ceiling: number
    income: number
    loss: number
  }
  theme: string
}

export type BudgetNote = {
  id: string
  budgetId: string
  text: string
  status: 'open' | 'closed'
  createdAt: Date
  editedAt?: Date
  closedAt?: Date
}

export type Transaction = {
  id: string
  budgetId: string
  type: 'default' | 'borrow'
  name: string
  payment: {
    type: '+' | '-',
    amount: number
  }
  createdAt: Date
  processed: boolean
  processedAt?: Date
}
