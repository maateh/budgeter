// types
import { UUID } from "crypto"
import { StorageCollection, StorageCollections } from "@/services/storage/types"

export interface IStorageHelper<D> {
  fetchFromStorage(collection: StorageCollections): Promise<StorageCollection<D>>
  saveToStorage(collection: StorageCollections, documents: StorageCollection<D>): Promise<void>

  find(collection: StorageCollections, filter?: (doc: D) => boolean): Promise<D[]>
  findById(collection: StorageCollections, id: UUID): Promise<D>

  save(collection: StorageCollections, document: D): Promise<D>
  bulkSave(collection: StorageCollections, documents: StorageCollection<D>): Promise<void>

  delete(collection: StorageCollections, id: UUID): Promise<void>
  bulkDelete(collection: StorageCollections, ids: UUID[]): Promise<void>
}
