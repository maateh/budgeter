import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Pagination, QueryOptions, Subpayment, Transaction } from "@/services/api/types"
import { TransactionDocument } from "@/services/storage/types"

// validations
import { relatedTransactionsFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetStorageAPI, SubpaymentStorageAPI } from "@/services/storage/collections"

// helpers
import { revertSubpaymentsOnBalance, updateBalance } from "@/services/storage/helpers/balance"
import { deleteTransactions, manageRelatedTransactions, updateTransaction } from "@/services/storage/helpers/transaction"
import { revertSubpayments } from "@/services/storage/helpers/subpayment"

// utils
import { paginate } from "@/services/storage/utils"

class TransactionStorageAPI implements ITransactionAPI {
  private static _instance: TransactionStorageAPI

  private storage: StorageHelper<TransactionDocument>

  private constructor() {
    this.storage = new StorageHelper('transactions')
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new TransactionStorageAPI()
    }
    return this._instance
  }

  public async getById(id: string): Promise<Transaction> {
    return await this.storage.findById(id)
  }

  public async getByIdWithBudget(id: string): Promise<Transaction & { budget: Budget }> {
    const budgetApi = BudgetStorageAPI.getInstance()

    const { budgetId, ...transaction } = await this.storage.findById(id)
    const budget = await budgetApi.getById(budgetId)

    return { ...transaction, budgetId, budget }
  }

  public async get({ params, filter, sortBy }: QueryOptions<Transaction> = {}): Promise<Pagination<Transaction>> {
    const transactions = await this.storage.find(filter)
    return paginate(transactions, { params, sortBy })
  }

  public async getWithBudget({ params, filter, sortBy }: QueryOptions<Transaction> = {}): Promise<Pagination<Transaction & { budget: Budget }>> {
    const budgetStorage = BudgetStorageAPI.getInstance().getStorage()

    const transactions = await this.storage.find()
    const budgets = await budgetStorage.fetchFromStorage()

    const { data, ...pagination } = paginate(transactions, { params, filter, sortBy })
    return {
      ...pagination,
      data: data.reduce((trs, tr) => ([
        ...trs,
        { ...tr, budget: budgets[tr.budgetId] }
      ]), [] as (Transaction & { budget: Budget })[])
    }
  }

  public async create(data: z.infer<typeof transactionFormSchema | typeof transferMoneyFormSchema>): Promise<Transaction> {
    const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

    const { budgetId, type, name, relatedIds = [], payment } = data
    const date = new Date()

    const transaction = await this.storage.save({
      id: crypto.randomUUID(),
      budgetId,
      type,
      name,
      createdAt: date,
      updatedAt: date,
      relatedIds,
      payment: {
        ...payment,
        processedAmount: 0,
        processedAt: payment.processed ? payment.processedAt || date : undefined,
        createdAt: date
      }
    })


    let subpayment: Subpayment = {
      id: crypto.randomUUID(),
      budgetId,
      transactionId: transaction.id,
      type: payment.type,
      amount: payment.amount,
      createdAt: date
    }

    if (type === 'borrow') {
      const rootSubpayment = await subpaymentStorage.save({ ...subpayment, isBorrowmentRoot: true })
      await updateBalance(transaction, rootSubpayment, { action: 'execute' })
    }

    if (!payment.processed) return transaction

    if (type === 'borrow') {
      subpayment = await subpaymentStorage.save({
        ...subpayment,
        id: crypto.randomUUID(),
        type: payment.type === '+' ? '-' : '+',
      })
      return await updateTransaction(transaction.id, subpayment, 'execute')
    }

    await subpaymentStorage.save(subpayment)
    return await updateTransaction(transaction.id, subpayment, 'execute')
  }

  public async delete(id: string, removeRelated: boolean = false): Promise<Transaction> {
    const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

    const transaction = await this.storage.findById(id)
    const subpayments = await subpaymentStorage.find({
      filterBy: { transactionId: id }
    })

    /**
     * If related transactions need to be removed, we have
     * to perform a bulk delete instead of a single delete.
     */
    if (removeRelated) {
      await deleteTransactions({
        filterBy: { id: [id, ...transaction.relatedIds] }
      }, true)

      return transaction
    }

    /**
     * Revert payments on the affected budgets and remove
     * transaction id from its related transactions.
     */
    await revertSubpaymentsOnBalance(subpayments)
    await manageRelatedTransactions(id, transaction.relatedIds, 'remove')
      
    /** Remove transaction from storage */
    await this.storage.deleteById(id)

    return transaction
  }

  public async updateStatus(id: string, processed: boolean): Promise<Transaction> {
    const subpaymentApi = SubpaymentStorageAPI.getInstance()
    const subpaymentStorage = subpaymentApi.getStorage()

    const { budgetId, type, payment } = await this.storage.findById(id)

    if (type !== 'default') {
      throw new Error('You can only update transactions of the default type.')
    }

    if (processed) {
      const { type, amount } = payment
      await subpaymentApi.addSubpayment(id, { budgetId, type, amount })
      return await this.storage.findById(id)
    }

    const subpayments = await subpaymentStorage.find({ filterBy: { transactionId: id }})
    await revertSubpayments(subpayments)

    return await this.storage.findById(id)
  }

  public async addRelated(id: string, data: z.infer<typeof relatedTransactionsFormSchema>): Promise<Transaction> {
    return await manageRelatedTransactions(id, data.relatedIds, 'add')
  }

  public async removeRelated(id: string, relatedId: string): Promise<Transaction> {
    return await manageRelatedTransactions(id, [relatedId], 'remove')
  }

  public async transferMoney(
    data: z.infer<typeof transferMoneyFormSchema>
  ): Promise<{ rootTransaction: Transaction; targetTransaction: Transaction }> {
    let rootTransaction = await this.create({
      ...data,
      payment: {
        ...data.payment,
        type: data.payment.type === '+' ? '-' : '+'
      }
    })

    const targetTransaction = await this.create({
      ...data,
      budgetId: data.targetBudgetId,
      relatedIds: [rootTransaction.id]
    })

    rootTransaction = await this.storage.save({
      ...rootTransaction,
      relatedIds: [targetTransaction.id]
    })

    return { rootTransaction, targetTransaction }
  }

  public getStorage() {
    return this.storage
  }
}

export default TransactionStorageAPI
