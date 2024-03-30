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
  balance: {
    currency: string
    current: number
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

export type Payment = {
  id: string
  transactionId: string
  type: '+' | '-',
  amount: number
  processAmount?: number
}

export type Transaction = {
  id: string
  budgetId: string
  type: 'default' | 'borrow' | 'transfer'
  name: string
  payment: Payment
  subpayments: Payment[]
  createdAt: Date
  updatedAt: Date
  processed: boolean
  processedAt?: Date
  related: string[]
}
