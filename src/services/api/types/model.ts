export type Currencies = {
  [key: string]: string
}

export type Balance = {
  currency: string
  current: number
  income: number
  loss: number
  borrowment: number
}

export type Budget = {
  id: string
  name: string
  balance: Balance
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
  relatedIds: string[]
}
