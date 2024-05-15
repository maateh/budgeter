export type Currency = [
  key: 'string',
  value: 'string'
]

export type Balance = {
  currency: string
  current: number
  income: number
  loss: number
  borrowment: {
    plus: number
    minus: number
  }
}

export type Budget = {
  id: string
  name: string
  theme: string
  balance: Balance
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
  type: '+' | '-',
  amount: number
  createdAt: Date
}

export type BasePayment = Payment & {
  processedAmount: number
  processed: boolean
  processedAt?: Date
}

export type Subpayment = Payment & {
  id: string
  budgetId: string
  transactionId: string
  isBorrowmentRoot?: boolean
}

export type Transaction = {
  id: string
  budgetId: string
  type: 'default' | 'borrow' | 'transfer'
  name: string
  createdAt: Date
  updatedAt: Date
  relatedIds: string[]
  payment: BasePayment
}
