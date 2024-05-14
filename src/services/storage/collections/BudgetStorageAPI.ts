import { z } from "zod"

// interfaces
import { IBudgetAPI } from "@/services/api/interfaces"

// types
import { Balance, Budget, Pagination, QueryOptions } from "@/services/api/types"
import { BudgetDocument } from "@/services/storage/types"

// validations
import { budgetFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetNoteStorageAPI, SubpaymentStorageAPI } from "@/services/storage/collections"

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
    return paginate(budgets, { params, sortBy })
  }

  public async getSummarizedBalance(currency: string): Promise<Balance> {
    const budgets = await this.storage.find()

    return budgets.reduce((summarizedBalance, { balance }) => {
      const {
        current = 0,
        income = 0,
        loss = 0,
        borrowment = { plus: 0, minus: 0 }
      } = summarizedBalance
  
      // TODO: multiply values based on the given currency
      // This might be an option: https://www.exchangerate-api.com/docs/free
  
      return {
        currency,
        current: current + balance.current,
        income: income + balance.income,
        loss: loss + balance.loss,
        borrowment: {
          plus: borrowment.plus + balance.borrowment.plus,
          minus: borrowment.minus + balance.borrowment.minus,
        }
      }
    }, {} as Balance)
  }

  public async create(data: z.infer<typeof budgetFormSchema>): Promise<Budget> {
    return await this.storage.save({
      id: crypto.randomUUID(),
      name: data.name,
      balance: {
        ...data.balance,
        income: 0,
        loss: 0,
        borrowment: { plus: 0, minus: 0 }
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
    const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

    /** Delete affected notes from the storage */
    await noteStorage.bulkDelete({ filterBy: { budgetId: id }})

    /** Delete affected transactions from the storage */
    await deleteTransactions({ filterBy: { budgetId: id } }, false)

    /** Delete affected subpayments from the storage */
    await subpaymentStorage.bulkDelete({ filterBy: { budgetId: id }})

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
