import { UUID } from "crypto"

// interfaces
import { IStorageHelper } from "@/services/storage/interfaces"

// types
import { StorageCollection, StorageCollections } from "@/services/storage/types"

class StorageHelper<T extends { id: UUID }> implements IStorageHelper<T> {
  async fetchFromStorage(collection: StorageCollections): Promise<StorageCollection<T>> {
    const plainDocs = localStorage.getItem(collection) || '{}'
    return JSON.parse(plainDocs)
  }

  async saveToStorage(collection: StorageCollections, documents: StorageCollection<T>) {
    localStorage.setItem(collection, JSON.stringify(documents))
  }

  async find(collection: StorageCollections): Promise<StorageCollection<T>> {
    return await this.fetchFromStorage(collection)
  }

  async findById(collection: StorageCollections, id: string): Promise<T> {
    const documents = await this.fetchFromStorage(collection)
    return documents[id]
  }

  async save(collection: StorageCollections, document: T): Promise<T> {
    const documents = await this.fetchFromStorage(collection)
    await this.saveToStorage(collection, {
      ...documents,
      [document.id]: document
    })

    return document
  }

  async bulkSave(collection: StorageCollections, documents: StorageCollection<T>) {
    await this.saveToStorage(collection, {
      ...await this.fetchFromStorage(collection),
      ...documents, 
    })
  }

  async delete(collection: StorageCollections, id: string) {
    const documents = await this.fetchFromStorage(collection)
    delete documents[id]
    await this.saveToStorage(collection, documents)
  }

  async bulkDelete(collection: StorageCollections, ids: string[]) {
    const documents = await this.fetchFromStorage(collection)
    ids.forEach(id => delete documents[id])
    await this.saveToStorage(collection, documents)
  }
}

export default StorageHelper
