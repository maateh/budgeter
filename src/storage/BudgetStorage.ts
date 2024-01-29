// types
import { DocumentCollection, ModelCollection, BudgetDocument } from "@/types"

// storage
import Storage from "@/storage"

// models
import Budget, { BudgetProps } from "@/models/Budget"
import Transaction from "@/models/Transaction"

class BudgetStorage {
  // TODO: move it elsewhere
  static convertToModel(document: BudgetDocument, transactions: ModelCollection['transaction']): Budget {
    return new Budget(document.id, { ...document, transactions })
  }

  // TODO: move it elsewhere
  static convertToDocument(budget: Budget): BudgetDocument {
    const transactionIds = Object.keys(budget.transactions)
    return {
      id: budget.id,
      name: budget.name,
      type: budget.type,
      balance: budget.balance,
      theme: budget.theme,
      transactionIds
    }
  }

  static async fetchFromStorage(): Promise<DocumentCollection['budget']> {
    const plainBudgets = localStorage.getItem('budgets') || '{}'
    return JSON.parse(plainBudgets)
  }

  static async findAll(): Promise<ModelCollection['budget']> {
    const documents = await this.fetchFromStorage()
    const transactions = await Storage.transaction.findAll()

    return Object.entries(documents)
      .reduce((budgets, [key, budgetDoc]) => {
        const budgetTransactions = Storage.transaction.filterByBudget(key, transactions)
        return {
          ...budgets,
          [key]: this.convertToModel(budgetDoc, budgetTransactions)
        }
      }, {})
  }

  static async find(id: string): Promise<Budget> {
    const documents = await this.fetchFromStorage()
    const transactions = await Storage.transaction.findByBudget(id)

    const budgetDoc = documents[id]
    if (!budgetDoc) {
      throw Error('Budget not found with the specified ID.')
    }

    return this.convertToModel(budgetDoc, transactions)
  }

  // TODO: bulkSave

  static async save(id: string, props: BudgetProps): Promise<Budget> {
    const documents = await this.fetchFromStorage()

    const budget = new Budget(id, props)
    documents[id] = this.convertToDocument(budget)
    localStorage.setItem('budgets', JSON.stringify(documents))

    return budget
  }

  // TODO: bulkDelete

  static async delete(id: string) {
    const documents = await this.fetchFromStorage()
    await Storage.transaction.bulkDelete(documents[id].transactionIds)

    delete documents[id]
    localStorage.setItem('budgets', JSON.stringify(documents))
  }

  static async addTransactions(budgetId: string, transactions: Transaction[]) {
    const budget = await this.find(budgetId)
    budget.executeTransactions(transactions)

    const updatedBudget = await this.save(budget.id, budget)
    return updatedBudget
  }

  static async deleteTransactions(budgetId: string, transactionIds: string[]) {
    const budget = await this.find(budgetId)
    transactionIds.forEach(id => delete budget.transactions[id])

    const updatedBudget = await this.save(budget.id, budget)
    return updatedBudget
  }
}

export default BudgetStorage
