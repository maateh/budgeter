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
      balance: {
        ...data.balance,
        income: 0,
        loss: 0
      },
      theme: data.theme
    })
  }

  public async update(id: UUID, data: z.infer<typeof BudgetValidation>): Promise<Budget> {
    const budget = await this.storage.findById(id)

    return await this.storage.save({
      ...budget,
      ...data,
      type: data.type as Budget['type'],
      balance: { ...budget.balance, ...data.balance }
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
  public async managePayments(budgetId: UUID, payments: Transaction['payment'][], action: 'execute' | 'undo') {
    const budget = await this.storage.findById(budgetId)

    payments.forEach((payment) => {
      this.managePayment(budget, payment, action)
    })

    await this.storage.save(budget)
  }

/**
 * Manages payments within a budget by updating the balance based on the given payment and action.
 * If the action is 'execute', it applies the payment to the budget's balance. If the action is 'undo',
 * it reverts the effect of the payment.
 *
 * @param {object} budget - The budget object containing a balance property.
 * @param {object} payment - The payment object with type (either '+' for income or '-' for loss) and amount.
 * @param {string} action - The action to be performed: 'execute' to apply the payment or 'undo' to revert it.
 * @returns {void}
 */
  private managePayment(budget: Budget, payment: Transaction['payment'], action: 'execute' | 'undo'): void {
    const { current, income, loss } = budget.balance
    const { type, amount } = payment
  
    const update = action === 'execute' ? 1 : -1
  
    const currentDelta = type === '+' ? amount * update : -amount * update
    const incomeDelta = type === '+' ? amount * update : 0
    const lossDelta = type === '-' ? amount * update : 0
  
    budget.balance = {
      ...budget.balance,
      current: current + currentDelta,
      income: income + incomeDelta,
      loss: loss + lossDelta
    }
  }
}

export default BudgetStorageAPI
