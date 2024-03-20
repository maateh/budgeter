// types
import { StorageCollection } from "@/services/storage/types"

export interface IStorageHelper<D> {
  fetchFromStorage(): Promise<StorageCollection<D>>
  saveToStorage(documents: StorageCollection<D>): Promise<void>

  find(filterBy?: Partial<D>): Promise<D[]>
  findById(id: string): Promise<D>

  save(document: D): Promise<D>
  bulkSave(documents: StorageCollection<D>): Promise<void>

  deleteById(id: string): Promise<void>
  bulkDelete(filter?: (document: D) => boolean): Promise<void>

  restore(documents: StorageCollection<D>, filter?: (document: D) => boolean): Promise<void>
}
