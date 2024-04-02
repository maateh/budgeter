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

// filter
export type Filter<T> = {
  [K in keyof T]?: T[K] | T[K][]
}

export type FilterOptions<T> = {
  filterBy?: Filter<T>
  excludeBy?: Filter<T>
}

// options
export type QueryOptions<T> = {
  params?: PaginationParams
  filter?: FilterOptions<T>
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
  budgetId: string
  transactionId: string
  type: '+' | '-',
  amount: number
  createdAt: Date
  processedAmount?: number
  isSubpayment: boolean
}

export type Transaction = {
  id: string
  budgetId: string
  payment: Payment
  type: 'default' | 'borrow' | 'transfer'
  name: string
  createdAt: Date
  updatedAt: Date
  processed: boolean
  processedAt?: Date
  related: string[]
}
