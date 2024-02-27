// types
import { UUID } from "crypto"
import { StorageCollection } from "@/services/storage/types"

export interface IStorageHelper<D> {
  fetchFromStorage(): Promise<StorageCollection<D>>
  saveToStorage(documents: StorageCollection<D>): Promise<void>

  find(filter?: (doc: D) => boolean): Promise<D[]>
  findById(id: UUID): Promise<D>

  save(document: D): Promise<D>
  bulkSave(documents: StorageCollection<D>): Promise<void>

  delete(id: UUID): Promise<void>
  bulkDelete(ids: UUID[]): Promise<void>
}
