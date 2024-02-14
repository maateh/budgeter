// models
import Budget, { Balance, BudgetNote, BudgetTheme, BudgetType } from "@/models/Budget"
import Transaction, { Payment } from "@/models/Transaction"

export type BudgetDocument = {
  id: string
  name: string
  type: BudgetType
  balance: Balance
  currency: string
  theme: BudgetTheme
  notes: {[key: string]: BudgetNote}
  transactionIds: string[]
}

export type TransactionDocument = {
  id: string
  budgetId: string
  targetBudgetId?: string
  type: 'default' | 'transferring' | 'temporary'
  label: string
  payment: Payment
  status: 'processed' | 'processing'
  date: {
    created: string
    expected: string
    credited?: string
    expire?: string
  }
}

export type DocumentCollection = {
  budget: {[key: string]: BudgetDocument},
  transaction: {[key: string]: TransactionDocument}
}

export type ModelCollection = {
  budget: {[key: string]: Budget},
  transaction: {[key: string]: Transaction}
}

export type Currencies = {
  [key: string]: string
}
