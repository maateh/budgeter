// types
import { DocumentCollection, ModelCollection, TransactionDocument } from "@/types"
import Transaction from "@/models/Transaction"

// interfaces
import { ITransactionAPI } from "@/api/interfaces"

// api
import API from "@/api"

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

  async findAll(status?: Transaction['status']): Promise<ModelCollection['transaction']> {
    const documents = await this.fetchFromStorage()
    let predicate = (doc: TransactionDocument) => !!doc

    if (status === 'processing') {
      predicate = (doc: TransactionDocument) => doc.status === 'processing'
    }

    if (status === 'processed') {
      predicate = (doc: TransactionDocument) => doc.status === 'processed'
    }

    return Transaction.bulkConvertToModel(documents, predicate)
  }

  async findByBudget(budgetId: string, status?: Transaction['status']): Promise<ModelCollection['transaction']> {
    const models = await this.findAll(status)
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
    const document = documents[id]

    await API.budget.deleteTransactions(document.budgetId, [document.id])
    delete documents[id]
    
    localStorage.setItem('transactions', JSON.stringify(documents))
    return true
  }
}

export default TransactionStorage
