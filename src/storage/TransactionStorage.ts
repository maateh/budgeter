// types
import { DocumentCollection, ModelCollection, TransactionDocument } from "@/types"

// models
import Transaction, { TransactionProps } from "@/models/Transaction"

class TransactionStorage {
  // TODO: move it elsewhere
  static convertToModel(document: TransactionDocument): Transaction {
    return new Transaction(document.id, {
      ...document,
      date: new Date(document.date)
    })
  }

  // TODO: move it elsewhere
  static convertToDocument(transaction: Transaction): TransactionDocument {
    return {
      ...transaction,
      date: transaction.date.toString()
    }
  }

  static async fetchFromStorage(): Promise<DocumentCollection['transaction']> {
    const plainTransactions = localStorage.getItem('transactions') || '{}'
    return JSON.parse(plainTransactions)
  }

  static async findAll(): Promise<ModelCollection['transaction']> {
    const documents = await this.fetchFromStorage()

    return Object.entries(documents)
      .sort(t => Date.parse(t[1].date))
      .reduce((transactions, [key, transactionDoc]) => ({
        ...transactions,
        [key]: this.convertToModel(transactionDoc)
      }), {})
  }

  static async findByBudget(budgetId: string): Promise<ModelCollection['transaction']> {
    const models = await this.findAll()
    return this.filterByBudget(budgetId, models)
  }

  static async find(id: string): Promise<Transaction> {
    const documents = await this.fetchFromStorage()
    const transactionDoc = documents[id]

    if (!transactionDoc) {
      throw Error('Transaction not found with the specified ID.')
    }

    return this.convertToModel(transactionDoc)
  }

  // TODO: bulkSave

  static async save(id: string, props: TransactionProps): Promise<Transaction> {
    const documents = await this.fetchFromStorage()

    const transaction = new Transaction(id, props)
    documents[id] = this.convertToDocument(transaction)
    localStorage.setItem('transactions', JSON.stringify(documents))

    return transaction
  }

  static async bulkSave(documents: DocumentCollection['transaction']): Promise<ModelCollection['transaction']> {
    localStorage.setItem('transactions', JSON.stringify(documents))
    return await this.findAll()
  }

  static async bulkDelete(ids: string[]) {
    const documents = await this.fetchFromStorage()
    ids.forEach(id => delete documents[id])
    
    await this.bulkSave(documents)
  }

  static async delete(id: string) {
    const documents = await this.fetchFromStorage()

    delete documents[id]
    localStorage.setItem('transactions', JSON.stringify(documents))
  }

  // TODO: move it elsewhere
  static filterByBudget(budgetId: string, models: ModelCollection['transaction']): ModelCollection['transaction'] {
    return Object.entries(models)
      .filter(t => t[1].budgetId === budgetId)
      .reduce((transactions, [key, transaction]) => ({
        ...transactions,
        [key]: transaction
      }), {})
  }
}

export default TransactionStorage
