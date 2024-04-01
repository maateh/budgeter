import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Pagination, PaginationParams, Transaction } from "@/services/api/types"
import { TransactionDocument } from "@/services/storage/types"

// validations
import { transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"
import PaymentStorageAPI from "@/services/storage/PaymentStorageAPI"

// utils
import { paginate } from "@/utils"

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

  public async getByIdWithBudget(id: string): Promise<Transaction & { budget: Budget }> {
    const { budgetId, paymentId, ...doc } = await this.storage.findById(id)

    const budget = await BudgetStorageAPI.getInstance().getById(budgetId)
    const payment = await PaymentStorageAPI.getInstance()
      .getStorage().findById(paymentId)

    return { ...doc, budgetId, payment, budget }
  }

  // TODO: pagination
  public async get(params?: PaginationParams, filterBy?: Partial<Transaction>): Promise<Transaction[]> {
    const documents = await this.storage.find(filterBy)
    const payments = await PaymentStorageAPI.getInstance()
      .getStorage().fetchFromStorage()

    const transactions: Transaction[] = documents.map((doc) => ({
      ...doc,
      payment: payments[doc.paymentId]
    }))

    return transactions
      .sort(({ updatedAt: a }, { updatedAt: b }) => Date.parse(a.toString()) < Date.parse(b.toString()) ? 1 : -1)
      .slice(params?.offset, params?.limit)
  }

  // TODO: rename -> getWithBudget
  public async getPaginatedWithBudgets(
    params: PaginationParams,
    filterBy?: Partial<Transaction>
  ): Promise<Pagination<Transaction & { budget: Budget }>> {
    const transactions = await this.get(params, filterBy)
    const budgets = await BudgetStorageAPI.getInstance().getStorage().find()

    const { data, ...pagination } = paginate(
      transactions, params,
      ({ updatedAt: a }, { updatedAt: b }) => Date.parse(a.toString()) < Date.parse(b.toString()) ? 1 : -1
    )

    return {
      ...pagination,
      data: data.reduce((trs, tr) => ([
        ...trs,
        { ...tr, budget: budgets.find(b => b.id === tr.budgetId)! }
      ]), [] as (Transaction & { budget: Budget })[])
    }
  }

  public async create(data: z.infer<typeof transactionFormSchema | typeof transferMoneyFormSchema>): Promise<Transaction> {
    const paymentApi = PaymentStorageAPI.getInstance()
    const budgetApi = BudgetStorageAPI.getInstance()

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
      related: []
    })

    const payment = await paymentApi.getStorage()
      .save({
        ...data.payment,
        id: paymentId,
        budgetId,
        transactionId,
        processAmount: 0,
        createdAt: date,
        isSubpayment: false
      })

    if (type === 'borrow') {
      await budgetApi.manageBalance(budgetId, payment, 'execute')
    }

    if (!processed) return { ...doc, budgetId, payment, type, processed }

    if (type === 'borrow') {
      return await paymentApi.manageSubpayment(transactionId, {
        ...payment,
        id: crypto.randomUUID(),
        type: payment.type === '+' ? '-' : '+',
        isSubpayment: true
      }, 'execute')
    }

    return await paymentApi.managePayment(transactionId, payment, 'execute')
  }

  public async delete(id: string): Promise<Transaction> {
    const budgetApi = BudgetStorageAPI.getInstance()
    const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

    const { budgetId, paymentId, ...doc } = await this.storage.findById(id)
    const payment = await paymentStorage.findById(paymentId)

    await budgetApi.manageBalance(budgetId, payment, 'undo')

    await this.storage.deleteById(id)
    await paymentStorage.deleteById(paymentId)

    return { ...doc, budgetId, payment }
  }

  public async updateStatus(id: string, processed: boolean): Promise<Transaction> {
    const paymentApi = PaymentStorageAPI.getInstance()

    const { paymentId, type } = await this.storage.findById(id)

    if (type !== 'default') {
      throw new Error('You can only update transactions of the default type.')
    }

    const payment = await paymentApi.getStorage().findById(paymentId)
    return await paymentApi.managePayment(id, payment, processed ? 'execute' : 'undo')
  }

  public async transferMoney(
    data: z.infer<typeof transferMoneyFormSchema>
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

  // helpers
  public getStorage() {
    return this.storage
  }
}

export default TransactionStorageAPI
