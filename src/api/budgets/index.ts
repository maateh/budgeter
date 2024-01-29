// types
import { ModelCollection } from "@/types"
import Budget from "@/models/Budget"

class BudgetAPI {
  static async findAll(): Promise<ModelCollection['budget']> {
    // TODO: localStorage-> Storage.budget.findAll()
  }

  static async find(id: string): Promise<Budget> {
    // TODO: localStorage-> Storage.budget.find(id)
  }

  static async bulkSave(budgets: ModelCollection['budget']) {
    // TODO: localStorage-> Storage.budget.bulkSave(budgets)
  }

  static async save(budget: Budget) {
    // TODO: localStorage-> Storage.budget.save(budget.id, budget)
  }

  static async bulkDelete(ids: string[]) {
    // TODO: localStorage-> Storage.budget.bulkDelete(ids)
  }

  static async delete(id: string) {
    // TODO: localStorage-> Storage.budget.delete(id)
  }
}

export default BudgetAPI
