// types
import { StorageCollection } from "@/services/storage/types"

export interface IStorageHelper<D> {
  fetchFromStorage(): Promise<StorageCollection<D>>
  saveToStorage(documents: StorageCollection<D>): Promise<void>

  find(filterBy?: Partial<D>): Promise<D[]>
  findById(id: string): Promise<D>

  save(document: D): Promise<D>
  bulkSave(documents: StorageCollection<D>): Promise<void>

  delete(id: string): Promise<void>
  bulkDelete(filter: (doc: D) => boolean): Promise<void>
}
