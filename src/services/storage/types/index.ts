import { Budget, BudgetNote, Subpayment, Transaction } from "@/services/api/types"

// cache
export type CacheCollections = 'currencies' | 'rates'

export type CacheData<D> = {
  id: string
  expire: number
  data: D
}

// storage
export type StorageCollections = 'budgets' | 'notes' | 'transactions' | 'subpayments' | 'currencies' | 'rates'

export type StorageCollection<T> = Record<string, T>

// data documents
export type BudgetDocument = Budget

export type BudgetNoteDocument = BudgetNote

export type TransactionDocument = Transaction

export type SubpaymentDocument = Subpayment
