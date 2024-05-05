import { Budget, BudgetNote, Subpayment, Transaction } from "@/services/api/types"

export type StorageCollections = 'budgets' | 'notes' | 'transactions' | 'subpayments'

export type StorageCollection<T> = Record<string, T>

// data documents
export type BudgetDocument = Budget

export type BudgetNoteDocument = BudgetNote

export type TransactionDocument = Transaction

export type SubpaymentDocument = Subpayment
