import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Pagination, PaginationParams, Payment, Transaction } from "@/services/api/types"

// validations
import { transactionSchema } from "@/components/form/transaction/validations"
import { transferMoneySchema } from "@/components/form/transfer-money/validations"
import { paymentSchema } from "@/components/form/subpayment/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"

// utils
import { paginate } from "@/utils"

class TransactionStorageAPI implements ITransactionAPI {
  private static _instance: TransactionStorageAPI

  private storage: StorageHelper<Transaction>

  private constructor() {
    this.storage = new StorageHelper('transactions')
  }

  public static getInstance() {
    if (!TransactionStorageAPI._instance) {
      TransactionStorageAPI._instance = new TransactionStorageAPI()
    }
    return TransactionStorageAPI._instance
  }

  public async getByIdWithBudget(id: string): Promise<Transaction & { budget: Budget }> {
    const transaction = await this.storage.findById(id)
    const budget = await BudgetStorageAPI.getInstance().getById(transaction.budgetId)

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
    const budgets = await BudgetStorageAPI.getInstance().getStorage().find()

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
    const transactionId = crypto.randomUUID()
    const transaction = await this.storage.save({
      id: transactionId,
      budgetId: data.budgetId,
      type: data.type,
      name: data.name,
      payment: {
        id: crypto.randomUUID(),
        transactionId,
        ...data.payment,
      },
      createdAt: new Date(),
      processed: data.processed,
      processedAt: data.processedAt
    })

    if (!executePayment) return transaction

    if ((transaction.type === 'default' || transaction.type === 'transfer') && transaction.processed) {
      await BudgetStorageAPI.getInstance().manageBalance(
        transaction.budgetId, transaction.payment, 'execute'
      )
    }

    if (transaction.type === 'borrow' && !transaction.processed) {
      await BudgetStorageAPI.getInstance().manageBalance(
        transaction.budgetId, transaction.payment, 'execute'
      )
    }

    return transaction
  }

  public async delete(id: string, undoPayment = true): Promise<Transaction> {
    const transaction = await this.storage.findById(id)
    await this.storage.deleteById(id)

    if (!undoPayment) return transaction

    if (transaction.type === 'default' && transaction.processed) {
      await BudgetStorageAPI.getInstance().manageBalance(
        transaction.budgetId, transaction.payment, 'undo'
      )
    }

    if (transaction.type === 'borrow' && !transaction.processed) {
      await BudgetStorageAPI.getInstance().manageBalance(
        transaction.budgetId, transaction.payment, 'undo'
      )
    }

    return transaction
  }

  public async updateStatus(id: string, processed: boolean): Promise<Transaction> {
    const transaction = await this.storage.findById(id)

    transaction.processed = processed
    transaction.processedAt = processed ? new Date() : undefined

    if (transaction.type === 'default') {
      await BudgetStorageAPI.getInstance().manageBalance(
        transaction.budgetId,
        transaction.payment,
        processed ? 'execute' : 'undo'
      )
    }

    if (transaction.type === 'borrow' && !transaction.subpayments?.length) {
      await BudgetStorageAPI.getInstance().manageBalance(
        transaction.budgetId,
        transaction.payment,
        processed ? 'undo' : 'execute'
      )
    }

    return await this.storage.save(transaction)
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

  public async addSubpayment(id: string, data: z.infer<typeof paymentSchema>): Promise<Transaction> {
    const transaction = await this.storage.findById(id)
    
    const subpayment: Payment = {
      id: crypto.randomUUID(),
      transactionId: id,
      ...data
    }

    return await this.manageSubpayment(transaction, subpayment, 'execute')
  }

  public async removeSubpayment(id: string, paymentId: string): Promise<Transaction> {
    const transaction = await this.storage.findById(id)
    const subpayment = transaction.subpayments?.find(({ id }) => id === paymentId)

    if (!subpayment) {
      throw new Error('Subpayment not found!')
    }

    return await this.manageSubpayment(transaction, subpayment, 'undo')
  }

  // helpers
  public getStorage() {
    return this.storage
  }

/**
 * Manages subpayment execution within a transaction.
 * @param transaction - The transaction object containing the payment information.
 * @param subpayment - The subpayment to manage within the transaction.
 * @param action - The action to perform on the subpayment ('execute' or 'undo').
 * @returns A Promise resolving to the updated transaction after managing the subpayment.
 */
  private async manageSubpayment(transaction: Transaction, subpayment: Payment, action: 'execute' | 'undo'): Promise<Transaction> {
    await BudgetStorageAPI.getInstance().manageBalance(
      transaction.budgetId, subpayment, action
    )

    let payment: Payment = transaction.payment
    let subpayments: Payment[] = transaction.subpayments || []

    if (action === 'execute') {
      payment = {
        ...payment,
        paidBackAmount: subpayment.amount + (payment.paidBackAmount || 0)
      }
      subpayments = [...subpayments, subpayment]
    }

    if (action === 'undo') {
      payment = {
        ...payment,
        paidBackAmount: transaction.payment.paidBackAmount! - subpayment.amount
      }
      subpayments = subpayments.filter(({ id }) => id !== subpayment.id)
    }

    const processed = (payment.paidBackAmount || 0) >= payment.amount ? true : false

    return await this.storage.save({
      ...transaction,
      payment,
      subpayments,
      processed,
      processedAt: processed ? new Date() : undefined
    })
  }
}

export default TransactionStorageAPI
