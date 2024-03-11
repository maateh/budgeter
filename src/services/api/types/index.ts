import { UUID } from "crypto"

export type Currencies = {
  [key: string]: string
}

export type Budget = {
  id: UUID
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
  id: UUID
  budgetId: UUID
  text: string
  status: 'open' | 'closed'
  createdAt: Date
  editedAt?: Date
  closedAt?: Date
}

export type Transaction = {
  id: UUID
  budgetId: UUID
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
