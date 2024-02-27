import { UUID } from "crypto"
import { z } from "zod"

// interfaces
import { IBudgetAPI } from "@/services/api/interfaces"

// types
import { Budget, Transaction } from "@/services/api/types"

// validations
import { BudgetValidation } from "@/lib/validation"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetNoteStorageAPI from "@/services/storage/BudgetNoteStorageAPI"
import TransactionStorageAPI from "@/services/storage/TransactionStorageAPI"

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

  public async get(): Promise<Budget[]> {
    return await this.storage.find()
  }

  public async getById(id: UUID): Promise<Budget> {
    return await this.storage.findById(id)
  }

  public async create(data: z.infer<typeof BudgetValidation>): Promise<Budget> {
    return await this.storage.save({
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type as Budget['type'],
      balance: data.balance,
      theme: data.theme
    })
  }

  public async update(id: UUID, data: z.infer<typeof BudgetValidation>): Promise<Budget> {
    const budget = await this.storage.findById(id)

    return await this.storage.save({
      ...budget,
      ...data,
      type: data.type as Budget['type']
    })
  }

  public async delete(id: UUID): Promise<Budget> {
    const budget = await this.storage.findById(id)
    await this.storage.delete(id)

    await BudgetNoteStorageAPI.getInstance().getStorage()
      .bulkDelete((note) => note.budgetId === id)

    await TransactionStorageAPI.getInstance().getStorage()
      .bulkDelete(tr => tr.budgetId === id)

    return budget
  }

  // helpers
  async managePayments(budgetId: UUID, payments: Transaction['payment'][], action: 'execute' | 'undo') {
    const budget = await this.storage.findById(budgetId)

    payments.forEach((payment) => {
      const amountToAdd = payment.type === '+'
        ? payment.amount
        : -payment.amount

      budget.balance.current += action === 'execute'
        ? amountToAdd
        : -amountToAdd
    })

    await this.storage.save(budget)
  }
}

export default BudgetStorageAPI
