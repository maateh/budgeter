import { Budget, BudgetNote, Subpayment, Transaction } from "@/services/api/types"

// collections
export type StorageCollections = 'budgets' | 'notes' | 'transactions' | 'subpayments' | 'cache'

export type StorageCollection<T> = Record<string, T>

// data documents
export type BudgetDocument = Budget

export type BudgetNoteDocument = BudgetNote

export type TransactionDocument = Transaction

export type SubpaymentDocument = Subpayment

// cache
export type CacheKeys = 'currencies'

export type CacheData<D> = {
  id: CacheKeys
  expire: number
  data: D
}
