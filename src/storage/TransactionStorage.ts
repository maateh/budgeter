// types
import { DocumentData, ModelData, TransactionDocument } from "@/storage/types"

// models
import Transaction, { TransactionProps } from "@/models/Transaction"

class TransactionStorage {
  static async convertFromDocument(document: TransactionDocument): Promise<Transaction> {
    return new Transaction(document.id, { ...document })
  }

  static async convertToDocument(transaction: Transaction): Promise<TransactionDocument> {
    return { ...transaction }
  }

  static async fetchFromStorage(): Promise<DocumentData['transaction']> {
    const plainTransactions = localStorage.getItem('transactions') || '{}'
    return JSON.parse(plainTransactions)
  }

  static async findAll(): Promise<ModelData['transaction']> {
    const documents = await this.fetchFromStorage()

    return Object.entries(documents)
      .reduce((transactions, [key, transactionDoc]) => ({
        ...transactions,
        [key]: new Transaction(transactionDoc.id, transactionDoc)
      }), {})
  }

  static async findByBudget(budgetId: string): Promise<ModelData['transaction']> {
    const documents = await this.fetchFromStorage()
    // TODO: sort based on date

    return Object.entries(documents)
      .filter(t => t[1].budgetId === budgetId)
      .reduce((transactions, [key, transactionDoc]) => ({
        ...transactions,
        [key]: new Transaction(transactionDoc.id, transactionDoc)
      }), {})
  }

  static async find(id: string): Promise<Transaction> {
    const documents = await this.fetchFromStorage()
    const transactionDoc = documents[id]

    if (!transactionDoc) {
      throw Error('Transaction not found with the specified ID.')
    }

    return new Transaction(transactionDoc.id, transactionDoc)
  }

  static async save(id: string, props: TransactionProps): Promise<Transaction> {
    const documents = await this.fetchFromStorage()

    const transaction = new Transaction(id, props)
    documents[id] = await this.convertToDocument(transaction)
    localStorage.setItem('transactions', JSON.stringify(documents))

    return transaction
  }

  static async delete(id: string) {
    const documents = await this.fetchFromStorage()

    delete documents[id]
    localStorage.setItem('transactions', JSON.stringify(documents))
  }
}

export default TransactionStorage
