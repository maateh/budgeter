// types
import { DocumentCollection, ModelCollection } from "@/types"
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// interfaces
import { IBudgetAPI } from "@/services/api/interfaces"

// storage
import TransactionStorage from "@/services/storage/TransactionStorage"

class BudgetStorage implements IBudgetAPI {
  private static _instance: BudgetStorage

  private constructor() {}

  public static getInstance(): BudgetStorage {
    if (!BudgetStorage._instance) {
      BudgetStorage._instance = new BudgetStorage()
    }
    return BudgetStorage._instance
  }

  private async fetchFromStorage(): Promise<DocumentCollection['budget']> {
    const plainBudgets = localStorage.getItem('budgets') || '{}'
    return JSON.parse(plainBudgets)
  }

  async findAll(): Promise<ModelCollection['budget']> {
    const documents = await this.fetchFromStorage()
    const transactions = await TransactionStorage.getInstance().findAll()

    return Object.entries(documents)
      .reduce((budgets, [key, budgetDoc]) => {
        const budgetTransactions = Transaction.filterByBudget(key, transactions)
        return {
          ...budgets,
          [key]: Budget.convertToModel(budgetDoc, budgetTransactions)
        }
      }, {})
  }

  async find(id: string): Promise<Budget> {
    const documents = await this.fetchFromStorage()
    const transactions = await TransactionStorage.getInstance().findByBudget(id)

    const budgetDoc = documents[id]
    if (!budgetDoc) {
      throw new Error('Budget not found with the specified ID.')
    }

    return Budget.convertToModel(budgetDoc, transactions)
  }

  async bulkSave(models: ModelCollection['budget']): Promise<ModelCollection['budget']> {
    const documents = {
      ...await this.fetchFromStorage(),
      ...Budget.bulkConvertToDocument(models)
    }

    localStorage.setItem('budgets', JSON.stringify(documents))
    return await this.findAll()
  }

  async save(model: Budget): Promise<Budget> {
    const documents = await this.fetchFromStorage()

    documents[model.id] = Budget.convertToDocument(model)
    localStorage.setItem('budgets', JSON.stringify(documents))

    return model
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    const documents = await this.fetchFromStorage()
    ids.forEach(id => delete documents[id])
    
    localStorage.setItem('budgets', JSON.stringify(documents))
    return true
  }

  async delete(id: string): Promise<boolean> {
    const documents = await this.fetchFromStorage()
    delete documents[id]

    localStorage.setItem('budgets', JSON.stringify(documents))
    return true
  }

  async addTransactions(budgetId: string, transactions: Transaction[]): Promise<Budget> {
    const budget = await this.find(budgetId)
    budget.addTransactions(transactions, true)

    return await this.save(budget)
  }

  async deleteTransactions(budgetId: string, transactionIds: string[]): Promise<Budget> {
    const budget = await this.find(budgetId)
    budget.removeTransactions(transactionIds, true)

    return await this.save(budget)
  }
}

export default BudgetStorage
