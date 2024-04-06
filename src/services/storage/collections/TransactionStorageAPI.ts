import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, FilterOptions, Pagination, Payment, QueryOptions, Transaction } from "@/services/api/types"
import { StorageCollection, TransactionDocument } from "@/services/storage/types"

// validations
import { relatedTransactionsFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetStorageAPI, PaymentStorageAPI } from "@/services/storage/collections"

// helpers
import { revertPaymentsOnBalance, updateBalance } from "@/services/storage/helpers/balance"

// utils
import { paginate } from "@/services/storage/utils"
import { updatePayment } from "../helpers/transaction"

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

    const transaction: Transaction = { ...doc, budgetId, payment, type, processed }
    if (type === 'borrow') {
      await updateBalance(budgetId, payment, 'execute')
    }

    if (!processed) return transaction

    if (type === 'borrow') {
      const subpayment: Payment = {
        ...payment,
        id: crypto.randomUUID(),
        type: payment.type === '+' ? '-' : '+',
        isSubpayment: true
      }
      return await updatePayment(transactionId, subpayment, 'execute')
    }

    return await updatePayment(transactionId, payment, 'execute')
  }

  public async delete(id: string, removeRelated: boolean = false): Promise<Transaction> {
    const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

    const { paymentId, ...transaction } = await this.storage.findById(id)
    const payment = await paymentStorage.findById(paymentId)

    if (removeRelated) {
      await this.bulkDelete({
        filterBy: { id: [id, ...transaction.relatedIds] }
      }, true)

      return { ...transaction, payment }
    }

    // Undo payment that can affect on balance and remove
    // transaction id from the related transactions
    await updatePayment(transaction.id, payment, 'undo')
    await this.manageRelated(id, transaction.relatedIds, 'remove')
      
    // Remove transaction and its payments/subpayments
    await this.storage.deleteById(id)
    await paymentStorage.bulkDelete({ filterBy: { transactionId: id }})

    return { ...transaction, payment }
  }

  public async updateStatus(id: string, processed: boolean): Promise<Transaction> {
    const paymentApi = PaymentStorageAPI.getInstance()

    const { paymentId, type } = await this.storage.findById(id)

    if (type !== 'default') {
      throw new Error('You can only update transactions of the default type.')
    }

    const payment = await paymentApi.getStorage().findById(paymentId)
    return await updatePayment(id, payment, processed ? 'execute' : 'undo')
  }

  public async addRelated(id: string, data: z.infer<typeof relatedTransactionsFormSchema>): Promise<Transaction> {
    const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

    const { paymentId, ...transaction } = await this.manageRelated(
      id, data.relatedIds, 'add'
    )

    const payment = await paymentStorage.findById(paymentId)
    return { ...transaction, payment }
  }

  public async removeRelated(id: string, relatedId: string): Promise<Transaction> {
    const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

    const { paymentId, ...transaction } = await this.manageRelated(
      id, [relatedId], 'remove'
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

  // TODO: move to helpers (?)
  public async bulkDelete(filter?: FilterOptions<Transaction>, revertPayments: boolean = true): Promise<void> {
    const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

    // Remove affected transaction ids from relatedIds
    const transactions = await this.storage.find(filter)
    const ids = transactions.map((tr) => tr.id)

    const relatedTransactions = await this.storage.find({
      filterBy: { id: transactions.flatMap((tr) => tr.relatedIds) }
    })

    await this.storage.bulkSave(
      relatedTransactions.reduce((docs, tr) => ({
        ...docs,
        [tr.id]: {
          ...tr,
          relatedIds: tr.relatedIds.filter((id) => !ids.includes(id))
        }
      }), {} as StorageCollection<TransactionDocument>)
    )

    // Revert affected payments on budget balance
    if (revertPayments) {
      const payments = await paymentStorage.find({
        filterBy: { transactionId: ids, isSubpayment: false }
      })
      await revertPaymentsOnBalance(payments)
      await paymentStorage.bulkDelete({ filterBy: { transactionId: ids }})
    }

    // Delete affected payments & transactions from the storage
    await paymentStorage.bulkDelete({ filterBy: { transactionId: ids }})
    await this.storage.bulkDelete(filter)
  }

/** TODO: move to helpers
 * Manages related transactions for a given transaction by adding or removing related transaction IDs.
 *
 * @param id - The ID of the transaction to manage related transactions for.
 * @param unfilteredRelated - The array of related transaction IDs to add or remove.
 * @param action - The action to perform: 'add' to add related transactions or 'remove' to remove them.
 * @returns A Promise resolving to the updated transaction document after managing related transactions.
 */
  private async manageRelated(id: string, relatedIds: string[], action: 'add' | 'remove'): Promise<TransactionDocument> {
    // Filter out potential duplicates
    relatedIds = relatedIds.filter(
      (id) => relatedIds.some((_id) => _id === id)
    )

    // Callback for filtering based on the given action
    const filterOperation = (doc: TransactionDocument, ids: string[]): string[] => {
      return action === 'add'
        ? [...doc.relatedIds, ...ids]
        : doc.relatedIds.filter((id) => !ids.includes(id))
    }

    // Get and save related transactions to add the
    // current transaction ID as related
    const relatedTransactions = await this.storage.find({
      filterBy: { id: relatedIds }
    })

    await this.storage.bulkSave(
      relatedTransactions.reduce((docs, tr) => ({
        ...docs,
        [tr.id]: {
          ...tr,
          relatedIds: filterOperation(tr, [id])
        }
      }), {} as Record<string, TransactionDocument>)
    )

    // Get and save current transaction with the updated related ids
    const document = await this.storage.findById(id)
    return await this.storage.save({
      ...document,
      relatedIds: filterOperation(document, relatedIds)
    })
  }
}

export default TransactionStorageAPI
