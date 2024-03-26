import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Pagination, PaginationParams, Transaction } from "@/services/api/types"

// validations
import { transactionSchema } from "@/components/form/transaction/validations"
import { transferMoneySchema } from "@/components/form/transfer-money/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"

// utils
import { paginate } from "@/utils"

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

  public async getByIdWithBudget(id: string): Promise<Transaction & { budget: Budget }> {
    const transaction = await this.storage.findById(id)
    const budget = await this.budgetStorageApi.getById(transaction.budgetId)

    return { ...transaction, budget }
  }

  public async get(params?: PaginationParams, filterBy?: Partial<Transaction>): Promise<Transaction[]> {
    const transactions = await this.storage.find(filterBy)
    return transactions.slice(params?.offset, params?.limit)
  }

  public async getPaginatedWithBudgets(params: PaginationParams, filterBy?: Partial<Transaction>): Promise<
    Pagination<Transaction & { budget: Budget }>
  > {
    const transactions = await this.storage.find(filterBy)
    const budgets = await this.budgetStorageApi.getStorage().find()

    const { data, ...paginationData } = paginate(transactions, params)

    return {
      ...paginationData,
      data: data.reduce((trs, tr) => ([
        ...trs,
        { ...tr, budget: budgets.find(b => b.id === tr.budgetId)!}
      ]), [] as (Transaction & { budget: Budget })[])
    }
  }

  public async create(data: z.infer<typeof transactionSchema | typeof transferMoneySchema>, executePayment = true): Promise<Transaction> {
    const transaction = await this.storage.save({
      id: crypto.randomUUID(),
      budgetId: data.budgetId,
      type: data.type as Transaction['type'],
      name: data.name,
      payment: data.payment as Transaction['payment'],
      createdAt: new Date(),
      processed: data.processed,
      processedAt: data.processedAt
    })

    if (!executePayment) return transaction

    if ((transaction.type === 'default' || transaction.type === 'transfer') && transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'execute'
      )
    }

    if (transaction.type === 'borrow' && !transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'execute'
      )
    }

    return transaction
  }

  public async transferMoney(
    data: z.infer<typeof transferMoneySchema>
  ): Promise<{ rootTransaction: Transaction; targetTransaction: Transaction }> {
    const rootTransaction = await this.create({
      ...data,
      payment: {
        ...data.payment,
        type: data.payment.type === '+' ? '-' : '+'
      }
    })

    const targetTransaction = await this.create({
      ...data,
      budgetId: data.targetBudgetId
    })

    return { rootTransaction, targetTransaction }
  }

  public async updateStatus(id: string, processed: boolean): Promise<Transaction> {
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

    if (transaction.type === 'borrow') {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        processed ? 'undo' : 'execute'
      )
    }

    return await this.storage.save(transaction)
  }

  public async delete(id: string, undoPayment = true): Promise<Transaction> {
    const transaction = await this.storage.findById(id)
    await this.storage.deleteById(id)

    if (!undoPayment) return transaction

    if (transaction.type === 'default' && transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'undo'
      )
    }

    if (transaction.type === 'borrow' && !transaction.processed) {
      await this.budgetStorageApi.managePayments(
        transaction.budgetId,
        [transaction.payment],
        'undo'
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
