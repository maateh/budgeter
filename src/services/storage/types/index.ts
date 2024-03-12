import { UUID } from "crypto"

export type StorageCollections = 'budgets' | 'notes' | 'transactions'

export type StorageCollection<T> = Record<UUID, T>
