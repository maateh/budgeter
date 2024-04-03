import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Pagination, QueryOptions, Transaction } from "@/services/api/types"
import { TransactionDocument } from "@/services/storage/types"

// validations
import { relatedTransactionsFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetStorageAPI, PaymentStorageAPI } from "@/services/storage/collections"

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

  public async getByIdWithBudget(id: string): Promise<Transaction & { budget: Budget }> {
    const { budgetId, paymentId, ...doc } = await this.storage.findById(id)

    const budget = await BudgetStorageAPI.getInstance().getById(budgetId)
    const payment = await PaymentStorageAPI.getInstance()
      .getStorage().findById(paymentId)

    return { ...doc, budgetId, payment, budget }
  }

  public async get({ params, filter }: QueryOptions<Transaction> = {}): Promise<Pagination<Transaction>> {
    const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

    const documents = await this.storage.find(filter)
    const payments = await paymentStorage.fetchFromStorage()

    const transactions: Transaction[] = documents.map((doc) => ({
      ...doc,
      payment: payments[doc.paymentId]
    }))

    return paginate(
      transactions, params,
      ({ updatedAt: a }, { updatedAt: b }) => a < b ? 1 : -1
    )
  }

  public async getWithBudget({ params, filter }: QueryOptions<Transaction> = {}): Promise<Pagination<Transaction & { budget: Budget }>> {
    const budgetStorage = BudgetStorageAPI.getInstance().getStorage()

    const { data: transactions } = await this.get({ params, filter })
    const budgets = await budgetStorage.find()

    const { data, ...pagination } = paginate(
      transactions, params,
      ({ updatedAt: a }, { updatedAt: b }) => a < b ? 1 : -1
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
      related: data.related || []
    })

    const payment = await paymentApi.getStorage()
      .save({
        ...data.payment,
        id: paymentId,
        budgetId,
        transactionId,
        processedAmount: 0,
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

  public async addRelated(id: string, data: z.infer<typeof relatedTransactionsFormSchema>): Promise<Transaction> {
    const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

    const { paymentId, ...transaction } = await this.manageRelated(
      id, data.related, 'add'
    )

    const payment = await paymentStorage.findById(paymentId)
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
      related: [data.targetBudgetId]
    })

    const targetTransaction = await this.create({
      ...data,
      budgetId: data.targetBudgetId,
      related: [rootTransaction.id]
    })

    return { rootTransaction, targetTransaction }
  }

  // helpers
  public getStorage() {
    return this.storage
  }

/**
 * Manages related transactions for a given transaction by adding or removing related transaction IDs.
 *
 * @param id - The ID of the transaction to manage related transactions for.
 * @param unfilteredRelated - The array of related transaction IDs to add or remove.
 * @param action - The action to perform: 'add' to add related transactions or 'remove' to remove them.
 * @returns A Promise resolving to the updated transaction document after managing related transactions.
 */
  private async manageRelated(id: string, unfilteredRelated: string[], action: 'add' | 'remove'): Promise<TransactionDocument> {
    // Filter out potential duplicates
    const related: string[] = unfilteredRelated.filter(
      (id) => related.some((_id) => _id !== id)
    )

    // Callback for filtering based on the given action
    const filterOperation = (doc: TransactionDocument): string[] => {
      return action === 'add'
        ? [...doc.related, ...related]
        : doc.related.filter((_id) => _id !== id)
    }

    // Get and save related transactions to add the
    // current transaction ID as related
    const relatedTransactions = await this.storage.find({
      filterBy: { id: related }
    })

    await this.storage.bulkSave(
      relatedTransactions.reduce((docs, tr) => ({
        ...docs,
        [tr.id]: { ...tr, related: filterOperation(tr) }
      }), {} as Record<string, TransactionDocument>)
    )

    // Get and save current transaction with the updated related ids
    const document = await this.storage.findById(id)
    return await this.storage.save({
      ...document,
      related: filterOperation(document)
    })
  }
}

export default TransactionStorageAPI
