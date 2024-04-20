import { z } from "zod"

// interfaces
import { IBudgetAPI } from "@/services/api/interfaces"

// types
import { Budget, Pagination, QueryOptions } from "@/services/api/types"
import { BudgetDocument } from "@/services/storage/types"

// validations
import { budgetFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetNoteStorageAPI } from "@/services/storage/collections"

// helpers
import { deleteTransactions } from "@/services/storage/helpers/transaction"

// utils
import { paginate } from "@/services/storage/utils"

class BudgetStorageAPI implements IBudgetAPI {
  private static _instance: BudgetStorageAPI

  private storage: StorageHelper<BudgetDocument>

  private constructor() {
    this.storage = new StorageHelper('budgets')
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new BudgetStorageAPI()
    }
    return this._instance
  }

  public async getById(id: string): Promise<Budget> {
    return await this.storage.findById(id)
  }

  public async get({ params, filter, sortBy }: QueryOptions<Budget> = {}): Promise<Pagination<Budget>> {
    const budgets = await this.storage.find(filter)
    return paginate(budgets, params, sortBy)
  }

  public async create(data: z.infer<typeof budgetFormSchema>): Promise<Budget> {
    return await this.storage.save({
      id: crypto.randomUUID(),
      name: data.name,
      balance: {
        ...data.balance,
        income: 0,
        loss: 0
      },
      theme: data.theme
    })
  }

  public async update(id: string, data: z.infer<typeof budgetFormSchema>): Promise<Budget> {
    const budget = await this.storage.findById(id)

    return await this.storage.save({
      ...budget,
      ...data,
      balance: { ...budget.balance, ...data.balance }
    })
  }

  public async delete(id: string): Promise<Budget> {
    const noteStorage = BudgetNoteStorageAPI.getInstance().getStorage()

    /** Delete affected notes from the storage */
    await noteStorage.bulkDelete({ filterBy: { budgetId: id }})

    /** Delete affected transactions & payments from the storage */
    await deleteTransactions({ filterBy: { budgetId: id } })

    /** Delete budget from the storage */
    const budget = await this.storage.findById(id)
    await this.storage.deleteById(id)

    return budget
  }

  public getStorage() {
    return this.storage
  }
}

export default BudgetStorageAPI
