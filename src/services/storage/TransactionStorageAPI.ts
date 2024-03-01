import { UUID } from "crypto"
import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Transaction } from "@/services/api/types"

// validations
import { TransactionValidation } from "@/lib/validation"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"

class TransactionStorageAPI implements ITransactionAPI {
  private static _instance: TransactionStorageAPI

  private storage: StorageHelper<Transaction>
  private budgetStorageApi: BudgetStorageAPI

  private constructor() {
    this.storage = new StorageHelper('transactions')
    this.budgetStorageApi = BudgetStorageAPI.getInstance()
  }

  public static getInstance() {
    if (!TransactionStorageAPI._instance) {
      TransactionStorageAPI._instance = new TransactionStorageAPI()
    }
    return TransactionStorageAPI._instance
  }

  public async getTransactionsWithBudgets(
    type: Transaction['type'], budgetId?: UUID
  ): Promise<(Transaction & { budget: Budget })[]> {
    const transactions = await this.storage
      .find((tr) => (!budgetId || tr.budgetId === budgetId) && tr.type === type)

    const budgets = budgetId
      ? [await this.budgetStorageApi.getById(budgetId)]
      : await this.budgetStorageApi.get()

    return transactions.reduce((trs, tr) => ([
      ...trs,
      { ...tr, budget: budgets.find(b => b.id === tr.budgetId)! }
    ]), [] as (Transaction & { budget: Budget })[])
  }

  // public async getByBudgets(type: Transaction['type']): Promise<Transaction[]> {
  //   return await this.storage.find((tr) => tr.type === type)
  // }

  // public async getByBudget(budgetId: UUID, type?: Transaction['type']): Promise<Transaction[] >{
  //   return await this.storage
  //     .find((tr) => tr.budgetId === budgetId && tr.type === type)
  // }

  public async create(data: z.infer<typeof TransactionValidation>, executePayment = true): Promise<Transaction> {
    const transaction = await this.storage.save({
      id: crypto.randomUUID(),
      budgetId: data.budgetId as UUID,
      type: data.type as Transaction['type'],
      name: data.name,
      payment: data.payment as Transaction['payment'],
      createdAt: new Date(),
      processed: data.processed,
      processedAt: data.processedAt
    })

    if (!executePayment) return transaction

    if (transaction.type === 'default' && transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'execute'
      )
    }

    if (transaction.type === 'temporary' && !transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'execute'
      )
    }

    return transaction
  }

  public async updateStatus(id: UUID, processed: boolean): Promise<Transaction> {
    const transaction = await this.storage.findById(id)

    transaction.processed = processed
    transaction.processedAt = processed ? new Date() : undefined

    if (transaction.type === 'default') {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        processed ? 'execute' : 'undo'
      )
    }

    if (transaction.type === 'temporary') {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        processed ? 'undo' : 'execute'
      )
    }

    return await this.storage.save(transaction)
  }

  public async delete(id: UUID, undoPayment = true): Promise<Transaction> {
    const transaction = await this.storage.findById(id)
    await this.storage.delete(id)

    if (!undoPayment) return transaction

    await this.budgetStorageApi.managePayments(
      transaction.budgetId,
      [transaction.payment],
      transaction.type === 'default'
        ? 'undo' : 'execute'
    )

    if (transaction.type === 'default' && transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'undo'
      )
    }

    if (transaction.type === 'temporary' && transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'execute'
      )
    }

    return transaction
  }

  // helpers
  public getStorage() {
    return this.storage
  }
}

export default TransactionStorageAPI
