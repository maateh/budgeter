// types
import { DocumentData, ModelData, TransactionDocument } from "@/storage/types"

// models
import Transaction, { TransactionProps } from "@/models/Transaction"

class TransactionStorage {
  static convertToModel(document: TransactionDocument): Transaction {
    return new Transaction(document.id, {
      ...document,
      date: new Date(document.date)
    })
  }

  static convertToDocument(transaction: Transaction): TransactionDocument {
    return {
      ...transaction,
      date: transaction.date.toString()
    }
  }

  static async fetchFromStorage(): Promise<DocumentData['transaction']> {
    const plainTransactions = localStorage.getItem('transactions') || '{}'
    return JSON.parse(plainTransactions)
  }

  static async findAll(): Promise<ModelData['transaction']> {
    const documents = await this.fetchFromStorage()

    return Object.entries(documents)
      .sort(t => Date.parse(t[1].date))
      .reduce((transactions, [key, transactionDoc]) => ({
        ...transactions,
        [key]: this.convertToModel(transactionDoc)
      }), {})
  }

  static async findByBudget(budgetId: string): Promise<ModelData['transaction']> {
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

  static async save(id: string, props: TransactionProps): Promise<Transaction> {
    const documents = await this.fetchFromStorage()

    const transaction = new Transaction(id, props)
    documents[id] = this.convertToDocument(transaction)
    localStorage.setItem('transactions', JSON.stringify(documents))

    return transaction
  }

  static async bulkSave(documents: DocumentData['transaction']): Promise<ModelData['transaction']> {
    localStorage.setItem('transactions', JSON.stringify(documents))
    return await this.findAll()
  }

  static async delete(id: string) {
    const documents = await this.fetchFromStorage()

    delete documents[id]
    localStorage.setItem('transactions', JSON.stringify(documents))
  }

  static async deleteByBudget(budgetId: string) {
    const documents = await this.fetchFromStorage()

    const filteredDocs: DocumentData['transaction'] = Object.entries(documents)
      .filter(([, doc]) => doc.budgetId !== budgetId)
      .reduce((filteredDocs, [key, value]) => ({
        ...filteredDocs,
        [key]: value
      }), {})
    
    await this.bulkSave(filteredDocs)
  }

  static filterByBudget(budgetId: string, models: ModelData['transaction']): ModelData['transaction'] {
    return Object.entries(models)
      .filter(t => t[1].budgetId === budgetId)
      .reduce((transactions, [key, transaction]) => ({
        ...transactions,
        [key]: transaction
      }), {})
  }
}

export default TransactionStorage
