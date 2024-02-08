// models
import Budget, { Balance, BudgetTheme, BudgetType } from "@/models/Budget"
import Transaction, { TransactionType } from "@/models/Transaction"

export type BudgetDocument = {
  id: string
  name: string
  type: BudgetType
  balance: Balance
  currency: string
  theme: BudgetTheme
  transactionIds: string[]
}

export type TransactionDocument = {
  id: string
  label: string
  budgetId: string
  type: TransactionType
  amount: number
  status: 'processed' | 'processing'
  date: {
    crediting?: string
    expected: string
    creation: string
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