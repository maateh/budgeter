export type StorageCollections = 'budgets' | 'notes' | 'transactions'

export type StorageCollection<T> = {[key: string]: T}
