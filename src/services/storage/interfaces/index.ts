// types
import { StorageCollection, StorageCollections } from "@/services/storage/types"

export interface IStorageHelper<T> {
  fetchFromStorage(collection: StorageCollections): Promise<StorageCollection<T>>
  saveToStorage(collection: StorageCollections, documents: StorageCollection<T>): Promise<void>

  find(collection: StorageCollections): Promise<StorageCollection<T>>
  findById(collection: StorageCollections, id: string): Promise<T>

  save(collection: StorageCollections, document: T): Promise<T>
  bulkSave(collection: StorageCollections, documents: StorageCollection<T>): Promise<void>

  delete(collection: StorageCollections, id: string): Promise<void>
  bulkDelete(collection: StorageCollections, ids: string[]): Promise<void>
}
