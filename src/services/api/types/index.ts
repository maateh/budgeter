import { UUID } from "crypto"

export type BudgetDocument = {
  id: UUID
  name: string
  type: 'income' | 'expense'
  balance: {
    current: number
    ceiling: number
  }
  currency: string
  theme: {
    background: string
    foreground: string
  }
  notes: {[key: string]: BudgetNoteDocument}
}

export type BudgetNoteDocument = {
  id: UUID
  text: string
  date: {
    created: Date
    edited?: Date
    closed?: Date
  }
}

// TODO: Must be reworked to be able to handle
// different types of transactions correctly.
// But for now it's okay.
export type TransactionDocument = {
  id: UUID
  type: 'default' | 'transferring' | 'temporary'
  status: 'processed' | 'processing'
  expired?: boolean
  budgetId: string
  targetBudgetId?: string
  label: string
  payment: {
    type: '+' | '-',
    amount: number
  }
  date: {
    created: Date
    expected: Date
    credited?: Date
    expire?: Date
  }
}
