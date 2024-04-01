import { Transaction } from "@/services/api/types"

export type StorageCollections = 'budgets' | 'notes' | 'transactions' | 'payments'

export type StorageCollection<T> = Record<string, T>

export type TransactionDocument = Omit<Transaction, 'payment'> & {
  paymentId: string
}
