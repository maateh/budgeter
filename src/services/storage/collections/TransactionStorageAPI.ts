import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Pagination, Payment, QueryOptions, Transaction } from "@/services/api/types"
import { TransactionDocument } from "@/services/storage/types"

// validations
import { relatedTransactionsFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetStorageAPI, SubpaymentStorageAPI } from "@/services/storage/collections"

// helpers
import { updateBalance } from "@/services/storage/helpers/balance"
import { deleteTransactions, manageRelatedTransactions, updateTransaction } from "@/services/storage/helpers/transaction"

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
    const subpaymentApi = SubpaymentStorageAPI.getInstance()

    const transactionId = crypto.randomUUID()
    const paymentId = crypto.randomUUID()
    const date = new Date()

    const { budgetId, type, processed, ...doc } = await this.storage.save({
      ...data,
      id: transactionId,
      paymentId,
      createdAt: date,
      updatedAt: date,
      processedAt: data.processed ? data.processedAt || date : undefined,
      relatedIds: data.relatedIds || []
    })

    const payment = await subpaymentApi.getStorage().save({
      ...data.payment,
      id: paymentId,
      budgetId,
      transactionId,
      processedAmount: 0,
      createdAt: date,
      isSubpayment: false
    })

    const transaction: Transaction = { ...doc, budgetId, payment, type, processed }
    if (type === 'borrow') {
      await updateBalance(budgetId, payment, {
        action: 'execute',
        isBorrowment: true
      })
    }

    if (!processed) return transaction

    if (type === 'borrow') {
      const subpayment: Payment = {
        ...payment,
        id: crypto.randomUUID(),
        type: payment.type === '+' ? '-' : '+',
        isSubpayment: true
      }
      return await updateTransaction(transactionId, subpayment, 'execute')
    }

    return await updateTransaction(transactionId, payment, 'execute')
  }

  public async delete(id: string, removeRelated: boolean = false): Promise<Transaction> {
    const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

    const { paymentId, ...transaction } = await this.storage.findById(id)
    const payment = await subpaymentStorage.findById(paymentId)

    /**
     * If related transactions need to be removed, we have
     * to perform a bulk delete instead of a single delete
     */
    if (removeRelated) {
      await deleteTransactions({
        filterBy: { id: [id, ...transaction.relatedIds] }
      }, true)

      return { ...transaction, payment }
    }

    /**
     * Undo payment that can affect on balance and remove
     * transaction id from the related transactions
     */
    await updateTransaction(transaction.id, payment, 'undo')
    await manageRelatedTransactions(id, transaction.relatedIds, 'remove')
      
    /** Remove transaction and its payments/subpayments */
    await this.storage.deleteById(id)
    await subpaymentStorage.bulkDelete({ filterBy: { transactionId: id }})

    return { ...transaction, payment }
  }

  public async updateStatus(id: string, processed: boolean): Promise<Transaction> {
    const subpaymentApi = SubpaymentStorageAPI.getInstance()

    const { paymentId, type } = await this.storage.findById(id)

    if (type !== 'default') {
      throw new Error('You can only update transactions of the default type.')
    }

    const payment = await subpaymentApi.getStorage().findById(paymentId)
    return await updateTransaction(id, payment, processed ? 'execute' : 'undo')
  }

  public async addRelated(id: string, data: z.infer<typeof relatedTransactionsFormSchema>): Promise<Transaction> {
    const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

    const { paymentId, ...transaction } = await manageRelatedTransactions(
      id, data.relatedIds, 'add'
    )

    const payment = await subpaymentStorage.findById(paymentId)
    return { ...transaction, payment }
  }

  public async removeRelated(id: string, relatedId: string): Promise<Transaction> {
    const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

    const { paymentId, ...transaction } = await manageRelatedTransactions(
      id, [relatedId], 'remove'
    )

    const payment = await subpaymentStorage.findById(paymentId)
    return { ...transaction, payment }
  }

  public async transferMoney(
    data: z.infer<typeof transferMoneyFormSchema>
  ): Promise<{ rootTransaction: Transaction; targetTransaction: Transaction }> {
    const rootTransaction = await this.create({
      ...data,
      payment: {
        ...data.payment,
        type: data.payment.type === '+' ? '-' : '+'
      },
      relatedIds: [data.targetBudgetId]
    })

    const targetTransaction = await this.create({
      ...data,
      budgetId: data.targetBudgetId,
      relatedIds: [rootTransaction.id]
    })

    return { rootTransaction, targetTransaction }
  }

  public getStorage() {
    return this.storage
  }
}

export default TransactionStorageAPI
