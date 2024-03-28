import { z } from "zod"

// interfaces
import { IBudgetAPI } from "@/services/api/interfaces"

// types
import { Budget, Pagination, PaginationParams } from "@/services/api/types"

// validations
import { budgetSchema } from "@/components/form/budget/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetNoteStorageAPI from "@/services/storage/BudgetNoteStorageAPI"
import TransactionStorageAPI from "@/services/storage/TransactionStorageAPI"

// utils
import { paginate } from "@/utils"

class BudgetStorageAPI implements IBudgetAPI {
  private static _instance: BudgetStorageAPI

  private storage: StorageHelper<Budget>

  private constructor() {
    this.storage = new StorageHelper('budgets')
  }

  public static getInstance(): BudgetStorageAPI {
    if (!BudgetStorageAPI._instance) {
      BudgetStorageAPI._instance = new BudgetStorageAPI()
    }
    return BudgetStorageAPI._instance
  }

  public async getById(id: string): Promise<Budget> {
    return await this.storage.findById(id)
  }

  public async get(params?: PaginationParams, filterBy?: Partial<Budget>): Promise<Budget[]> {
    const budgets = await this.storage.find(filterBy)
    return budgets.slice(params?.offset, params?.limit)
  }

  public async getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<Budget>> {
    const budgets = await this.storage.find(filterBy)
    return paginate(budgets, params)
  }

  public async create(data: z.infer<typeof budgetSchema>): Promise<Budget> {
    return await this.storage.save({
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type as Budget['type'],
      balance: {
        ...data.balance,
        income: 0,
        loss: 0
      },
      theme: data.theme
    })
  }

  public async update(id: string, data: z.infer<typeof budgetSchema>): Promise<Budget> {
    const budget = await this.storage.findById(id)

    return await this.storage.save({
      ...budget,
      ...data,
      type: data.type as Budget['type'],
      balance: { ...budget.balance, ...data.balance }
    })
  }

  public async delete(id: string): Promise<Budget> {
    const budget = await this.storage.findById(id)
    await this.storage.deleteById(id)

    await BudgetNoteStorageAPI.getInstance().getStorage()
      .bulkDelete((note) => note.budgetId === id)

    await TransactionStorageAPI.getInstance().getStorage()
      .bulkDelete((tr) => tr.budgetId === id)

    return budget
  }

  // helpers
  public getStorage() {
    return this.storage
  }
}

export default BudgetStorageAPI
