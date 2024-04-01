import { z } from "zod"

// interfaces
import { IBudgetAPI } from "@/services/api/interfaces"

// types
import { Budget, Pagination, Payment, QueryOptions } from "@/services/api/types"

// validations
import { budgetFormSchema } from "@/lib/validations"

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

  public static getInstance() {
    if (!this._instance) {
      this._instance = new BudgetStorageAPI()
    }
    return this._instance
  }

  public async getById(id: string): Promise<Budget> {
    return await this.storage.findById(id)
  }

  public async get({ params, filterBy }: QueryOptions<Budget> = {}): Promise<Pagination<Budget>> {
    const budgets = await this.storage.find(filterBy)
    return paginate(budgets, params)
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

/**
 * Manages payments within a budget by updating the balance based on the given payment and action.
 * If the action is 'execute', it applies the payment to the budget's balance. If the action is 'undo',
 * it reverts the effect of the payment.
 *
 * @param id - The ID of the budget to manage payments for.
 * @param payment - The payment object with type (either '+' for income or '-' for loss) and amount.
 * @param action - The action to be performed: 'execute' to apply the payment or 'undo' to revert it.
 * @returns A Promise resolving to the updated budget after managing the payment.
 */
  public async manageBalance(id: string, payment: Payment, action: 'execute' | 'undo'): Promise<Budget> {
    const budget = await this.storage.findById(id)

    const { current, income, loss } = budget.balance
    const { type, amount } = payment

    const update: 1 | -1 = action === 'execute' ? 1 : -1

    const currentDelta = type === '+' ? amount * update : -amount * update
    const incomeDelta = type === '+' ? amount * update : 0
    const lossDelta = type === '-' ? amount * update : 0

    return await this.storage.save({
      ...budget,
      balance: {
        ...budget.balance,
        current: current + currentDelta,
        income: income + incomeDelta,
        loss: loss + lossDelta
      }
    })
  }
}

export default BudgetStorageAPI
