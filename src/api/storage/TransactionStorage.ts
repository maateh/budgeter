// types
import { DocumentCollection, ModelCollection } from "@/types"
import Transaction from "@/models/Transaction"

// interfaces
import { ITransactionAPI } from "@/api/interfaces"

class TransactionStorage implements ITransactionAPI {
  private static _instance: TransactionStorage

  private constructor() {}

  public static getInstance(): TransactionStorage {
    if (!TransactionStorage._instance) {
      TransactionStorage._instance = new TransactionStorage()
    }
    return TransactionStorage._instance
  }

  private async fetchFromStorage(): Promise<DocumentCollection['transaction']> {
    const plainTransactions = localStorage.getItem('transactions') || '{}'
    return JSON.parse(plainTransactions)
  }

  async findAll(): Promise<ModelCollection['transaction']> {
    const documents = await this.fetchFromStorage()
    return Transaction.bulkConvertToModel(documents)
  }

  async findByBudget(budgetId: string): Promise<ModelCollection['transaction']> {
    const models = await this.findAll()
    return Transaction.filterByBudget(budgetId, models)
  }

  async find(id: string): Promise<Transaction> {
    const documents = await this.fetchFromStorage()
    const transactionDoc = documents[id]

    if (!transactionDoc) {
      throw Error('Transaction not found with the specified ID.')
    }

    return Transaction.convertToModel(transactionDoc)
  }

  async bulkSave(models: ModelCollection['transaction']): Promise<ModelCollection['transaction']> {
    const documents = {
      ...await this.fetchFromStorage(),
      ...Transaction.bulkConvertToDocument(models)
    }

    localStorage.setItem('transactions', JSON.stringify(documents))
    return await this.findAll()
  }

  // TODO: here it's switched to model from document
  async save(model: Transaction): Promise<Transaction> {
    const documents = await this.fetchFromStorage()

    documents[model.id] = Transaction.convertToDocument(model)
    localStorage.setItem('transactions', JSON.stringify(documents))

    return model
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    const documents = await this.fetchFromStorage()
    ids.forEach(id => delete documents[id])
    
    localStorage.setItem('transactions', JSON.stringify(documents))
    return true
  }

  async delete(id: string): Promise<boolean> {
    const documents = await this.fetchFromStorage()
    delete documents[id]

    localStorage.setItem('transactions', JSON.stringify(documents))
    return true
  }
}

export default TransactionStorage
