// types
import { DocumentCollection, ModelCollection, TransactionDocument } from "@/types"
import Transaction from "@/models/Transaction"

// interfaces
import { ITransactionAPI } from "@/services/api/interfaces"

// storage
import BudgetStorage from "@/services/storage/BudgetStorage"

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
    const documents = await TransactionStorage.getInstance().fetchFromStorage()
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
    const models = await TransactionStorage.getInstance().findAll(status)
    return Transaction.filterByBudget(budgetId, models)
  }

  async find(id: string): Promise<Transaction> {
    const documents = await TransactionStorage.getInstance().fetchFromStorage()
    const transactionDoc = documents[id]

    if (!transactionDoc) {
      throw Error('Transaction not found with the specified ID.')
    }

    return Transaction.convertToModel(transactionDoc)
  }

  async bulkSave(budgetId: string, models: ModelCollection['transaction']): Promise<ModelCollection['transaction']> {
    const documents = {
      ...await TransactionStorage.getInstance().fetchFromStorage(),
      ...Transaction.bulkConvertToDocument(models)
    }

    await BudgetStorage.getInstance()
      .addTransactions(budgetId, Object.values(models))

    localStorage.setItem('transactions', JSON.stringify(documents))
    return await TransactionStorage.getInstance().findAll()
  }

  async save(model: Transaction): Promise<Transaction> {
    const documents = await TransactionStorage.getInstance().fetchFromStorage()

    await BudgetStorage.getInstance()
      .addTransactions(model.budgetId, [model])

    documents[model.id] = Transaction.convertToDocument(model)
    localStorage.setItem('transactions', JSON.stringify(documents))

    return model
  }

  async bulkDelete(ids: string[], budgetId?: string): Promise<void> {
    const documents = await TransactionStorage.getInstance().fetchFromStorage()

    ids.forEach(id => delete documents[id])

    if (budgetId) {
      await BudgetStorage.getInstance()
        .deleteTransactions(budgetId, ids)
    } else {
      // TODO: remove transactions from budgets even if isn't any budget is specified
    }
    
    localStorage.setItem('transactions', JSON.stringify(documents))
  }

  async delete(id: string): Promise<void> {
    const documents = await TransactionStorage.getInstance().fetchFromStorage()
    const document = documents[id]

    delete documents[id]
    await BudgetStorage.getInstance()
      .deleteTransactions(document.budgetId, [document.id])
    
    localStorage.setItem('transactions', JSON.stringify(documents))
  }
}

export default TransactionStorage
