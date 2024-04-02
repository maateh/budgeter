import { Budget, BudgetNote, Payment, Transaction } from "@/services/api/types"

export type StorageCollections = 'budgets' | 'notes' | 'transactions' | 'payments'

export type StorageCollection<T> = Record<string, T>

// data documents
export type BudgetDocument = Budget

export type BudgetNoteDocument = BudgetNote

export type TransactionDocument = {
  paymentId: string
} & Omit<Transaction, 'payment'>

export type PaymentDocument = Payment
