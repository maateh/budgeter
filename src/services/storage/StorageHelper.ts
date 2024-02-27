import { UUID } from "crypto"

// interfaces
import { IStorageHelper } from "@/services/storage/interfaces"

// types
import { StorageCollection, StorageCollections } from "@/services/storage/types"

class StorageHelper<D extends { id: UUID }> implements IStorageHelper<D> {
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

  public async find(filter?: (doc: D) => boolean): Promise<D[]> {
    const collectionDocs = await this.fetchFromStorage()
    const documents = Object.values(collectionDocs)

    if (!filter) {
      return documents
    }

    return documents.filter(filter)
  }

  public async findById(id: UUID): Promise<D> {
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

  public async delete(id: UUID) {
    const documents = await this.fetchFromStorage()
    delete documents[id]
    await this.saveToStorage(documents)
  }

  public async bulkDelete(filter: (doc: D) => boolean) {
    const documents = await this.fetchFromStorage()

    Object.values(documents)
      .filter(filter)
      .forEach((doc) => delete documents[doc.id])

    await this.saveToStorage(documents)
  }
}

export default StorageHelper
