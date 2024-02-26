import { UUID } from "crypto"

// interfaces
import { IStorageHelper } from "@/services/storage/interfaces"

// types
import { StorageCollection, StorageCollections } from "@/services/storage/types"

class StorageHelper<D extends { id: UUID }> implements IStorageHelper<D> {
  async fetchFromStorage(collection: StorageCollections): Promise<StorageCollection<D>> {
    const plainDocs = localStorage.getItem(collection) || '{}'
    return JSON.parse(plainDocs)
  }

  async saveToStorage(collection: StorageCollections, documents: StorageCollection<D>) {
    localStorage.setItem(collection, JSON.stringify(documents))
  }

  async find(collection: StorageCollections, filter?: (doc: D) => boolean): Promise<D[]> {
    const collectionDocs = await this.fetchFromStorage(collection)
    const documents = Object.values(collectionDocs)

    if (!filter) {
      return documents
    }

    return documents.filter(filter)
  }

  async findById(collection: StorageCollections, id: UUID): Promise<D> {
    const documents = await this.fetchFromStorage(collection)
    return documents[id]
  }

  async save(collection: StorageCollections, document: D): Promise<D> {
    const documents = await this.fetchFromStorage(collection)
    await this.saveToStorage(collection, {
      ...documents,
      [document.id]: document
    })

    return document
  }

  async bulkSave(collection: StorageCollections, documents: StorageCollection<D>) {
    await this.saveToStorage(collection, {
      ...await this.fetchFromStorage(collection),
      ...documents, 
    })
  }

  async delete(collection: StorageCollections, id: UUID) {
    const documents = await this.fetchFromStorage(collection)
    delete documents[id]
    await this.saveToStorage(collection, documents)
  }

  async bulkDelete(collection: StorageCollections, ids: UUID[]) {
    const documents = await this.fetchFromStorage(collection)
    ids.forEach(id => delete documents[id])
    await this.saveToStorage(collection, documents)
  }
}

export default StorageHelper
