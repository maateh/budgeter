// models
import Transaction, { Payment } from "@/models/Transaction"

export type TransactionDocument = {
  id: string
  type: 'default' | 'transferring' | 'temporary'
  status: 'processed' | 'processing'
  expired?: boolean
  budgetId: string
  targetBudgetId?: string
  label: string
  payment: Payment
  date: {
    created: string
    expected: string
    credited?: string
    expire?: string
  }
}

export type DocumentCollection = {
  // budget: {[key: string]: BudgetDocument},
  transaction: {[key: string]: TransactionDocument}
}

export type ModelCollection = {
  // budget: {[key: string]: Budget},
  transaction: {[key: string]: Transaction}
}

export type Currencies = {
  [key: string]: string
}
