// types
import { DocumentData, ModelData, BudgetDocument } from "@/storage/types"

// storage
import Storage from "@/storage"

// models
import Budget, { BudgetProps } from "@/models/Budget"
import Transaction from "@/models/Transaction"

class BudgetStorage {
  static async convertFromDocument(document: BudgetDocument): Promise<Budget> {
    const transactions = await Storage.transaction.findByBudget(document.id)
    return new Budget(document.id, { ...document, transactions })
  }

  static async convertToDocument(budget: Budget): Promise<BudgetDocument> {
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

  static async fetchFromStorage(): Promise<DocumentData['budget']> {
    const plainBudgets = localStorage.getItem('budgets') || '{}'
    return JSON.parse(plainBudgets)
  }

  static async findAll(): Promise<ModelData['budget']> {
    const documents = await this.fetchFromStorage()

    return Object.entries(documents)
      .reduce(async (budgets, [key, budgetDoc]) => {
        const budget = await this.convertFromDocument(budgetDoc)

        return {
          ...budgets,
          [key]: budget
        }
      }, {})
  }

  static async find(id: string): Promise<Budget> {
    const documents = await this.fetchFromStorage()
    const budgetDoc = documents[id]

    if (!budgetDoc) {
      throw Error('Budget not found with the specified ID.')
    }

    return await this.convertFromDocument(budgetDoc)
  }

  static async save(id: string, props: BudgetProps): Promise<Budget> {
    const documents = await this.fetchFromStorage()

    const budget = new Budget(id, props)
    documents[id] = await this.convertToDocument(budget)
    localStorage.setItem('budgets', JSON.stringify(documents))

    return budget
  }

  static async delete(id: string) {
    const documents = await this.fetchFromStorage()

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
