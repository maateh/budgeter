// types
import { StorageData } from "@/storage"

// models
import Budget, { BudgetProps } from "@/models/Budget"
import Transaction from "@/models/Transaction"

class BudgetStorage {
  static async findAll(): Promise<StorageData['budget']> {
    const plainBudgets = localStorage.getItem('budgets') || '{}'
    const parsedBudgets: StorageData['budget'] = JSON.parse(plainBudgets)

    return Object.entries(parsedBudgets)
      .reduce((budgets, [key, budget]) => ({
        ...budgets,
        [key]: new Budget(budget.id, budget)
      }), {})
  }

  static async find(id: string): Promise<Budget> {
    const budgets = await this.findAll()
    const budget = budgets[id]

    if (!budget) {
      throw Error('Budget not found with the specified ID.')
    }

    return budget
  }

  static async save(id: string, props: BudgetProps): Promise<Budget> {
    const budgets = await this.findAll()

    budgets[id] = new Budget(id, props)
    localStorage.setItem('budgets', JSON.stringify(budgets))

    return budgets[id]
  }

  static async delete(id: string) {
    const budgets = await this.findAll()

    delete budgets[id]
    localStorage.setItem('budgets', JSON.stringify(budgets))
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
