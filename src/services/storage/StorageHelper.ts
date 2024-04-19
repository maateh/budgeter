// interfaces
import { IStorageHelper } from "@/services/storage/interfaces"

// types
import { StorageCollection, StorageCollections } from "@/services/storage/types"
import { FilterOptions } from "@/services/api/types"

// utils
import { filter } from "@/services/storage/utils"

class StorageHelper<D extends { id: string }> implements IStorageHelper<D> {
  private collection: StorageCollections

  public constructor(collection: StorageCollections) {
    this.collection = collection
  }

  public async fetchFromStorage(): Promise<StorageCollection<D>> {
    const plainDocs = localStorage.getItem(this.collection) || '{}'
    return JSON.parse(plainDocs)
  }

  public async saveToStorage(documents: StorageCollection<D>) {
    localStorage.setItem(this.collection, JSON.stringify(documents))
  }

  public async find(filterOptions?: FilterOptions<D>): Promise<D[]> {
    const collectionDocs = await this.fetchFromStorage()
    const documents = Object.values(collectionDocs)
    return filter(documents, filterOptions)
  }

  public async findById(id: string): Promise<D> {
    const documents = await this.fetchFromStorage()
    return documents[id]
  }

  public async save(document: D): Promise<D> {
    const documents = await this.fetchFromStorage()
    await this.saveToStorage({
      ...documents,
      [document.id]: document
    })

    return document
  }

  public async bulkSave(documents: StorageCollection<D>) {
    await this.saveToStorage({
      ...await this.fetchFromStorage(),
      ...documents, 
    })
  }

  public async deleteById(id: string) {
    const documents = await this.fetchFromStorage()
    delete documents[id]
    await this.saveToStorage(documents)
  }

  public async bulkDelete({ filterBy, excludeBy }: FilterOptions<D> = {}) {
    const documents = await this.fetchFromStorage()

    filter(
      Object.values(documents), { filterBy, excludeBy }
    ).forEach((doc) => delete documents[doc.id])

    await this.saveToStorage(documents)
  }

  public async restore(documents: StorageCollection<D>, filter?: FilterOptions<D>): Promise<void> {
    await this.bulkDelete(filter)
    await this.bulkSave(documents)
  }
}

export default StorageHelper
