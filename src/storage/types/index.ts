// models
import Budget, { Balance, BudgetTheme, BudgetType } from "@/models/Budget"
import Transaction, { TransactionType } from "@/models/Transaction"

export type BudgetDocument = {
  id: string
  name: string
  type: BudgetType
  balance: Balance
  theme: BudgetTheme
  transactionIds: string[]
}

export type TransactionDocument = {
  id: string
  budgetId: string
  type: TransactionType
  amount: number
  date: Date
}

export type DocumentData = {
  budget: {[key: string]: BudgetDocument},
  transaction: {[key: string]: TransactionDocument}
}

export type ModelData = {
  budget: {[key: string]: Budget},
  transaction: {[key: string]: Transaction}
}
