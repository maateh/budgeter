import { z } from "zod"

// interfaces
import { ITransactionAPI } from "@/services//api/interfaces"

// types
import { Budget, Pagination, PaginationParams, Payment, Transaction } from "@/services/api/types"

// validations
import { paymentFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

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

  public async getPaginatedWithBudgets(
    params: PaginationParams,
    filterBy?: Partial<Transaction>
  ): Promise<Pagination<Transaction & { budget: Budget }>> {
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

  public async create(data: z.infer<typeof transactionFormSchema | typeof transferMoneyFormSchema>): Promise<Transaction> {
    const transactionId = crypto.randomUUID()
    const transaction = await this.storage.save({
      id: transactionId,
      budgetId: data.budgetId,
      type: data.type,
      name: data.name,
      payment: {
        id: crypto.randomUUID(),
        transactionId,
        processAmount: 0,
        ...data.payment,
      },
      subpayments: [],
      createdAt: new Date(),
      processed: data.processed,
      processedAt: data.processed ? data.processedAt || new Date() : undefined,
      related: []
    })

    if (transaction.type === 'borrow') {
      await BudgetStorageAPI.getInstance().manageBalance(
        transaction.budgetId, transaction.payment, 'execute'
      )
    }

    if (!transaction.processed) return transaction

    let subpayment: Payment = this.generateSubpaymentFromPayment(transaction.payment)
    if (transaction.type === 'borrow') {
      subpayment = {
        ...subpayment,
        type: transaction.payment.type === '+' ? '-' : '+'
      }
    }

    return await this.manageSubpayment(transaction, subpayment, 'execute')
  }

  public async delete(id: string): Promise<Transaction> {
    const transaction = await this.storage.findById(id)

    await BudgetStorageAPI.getInstance().manageBalance(transaction.budgetId, {
        ...transaction.payment,
        amount: transaction.type === 'borrow'
          ? transaction.payment.amount - (transaction.payment.processAmount || 0)
          : (transaction.payment.processAmount || 0)
      }, 'undo'
    )

    await this.storage.deleteById(id)
    return transaction
  }

  public async updateStatus(id: string, processed: boolean): Promise<Transaction> {
    const transaction = await this.storage.findById(id)

    if (transaction.type === 'default') {
      const subpayment = this.generateSubpaymentFromPayment(transaction.payment)

      return await this.manageSubpayment(
        transaction, subpayment, processed ? 'execute' : 'undo'
      )
    }

    if (transaction.type === 'borrow') {
      const subpayment = this.generateSubpaymentFromPayment({
        ...transaction.payment,
        type: transaction.payment.type === '+' ? '-' : '+',
        amount: transaction.payment.amount - (transaction.payment.processAmount || 0)
      })

      return await this.manageSubpayment(
        transaction, subpayment, processed ? 'execute' : 'undo'
      )
    }

    return await this.storage.save({
      ...transaction,
      processed,
      processedAt: processed ? new Date() : undefined
    })
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

  public async addSubpayment(id: string, data: z.infer<typeof paymentFormSchema>): Promise<Transaction> {
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
    let subpayments: Payment[] = transaction.subpayments

    if (action === 'execute') {
      payment = {
        ...payment,
        processAmount: subpayment.amount + (payment.processAmount || 0)
      }
      subpayments = [...subpayments, subpayment]
    }

    if (action === 'undo') {
      payment = {
        ...payment,
        processAmount: (payment.processAmount || 0) - subpayment.amount
      }
      subpayments = subpayments.filter(({ id }) => id !== subpayment.id)
    }

    const processed = (payment.processAmount || 0) >= payment.amount

    return await this.storage.save({
      ...transaction,
      payment,
      subpayments,
      processed,
      processedAt: processed ? new Date() : undefined
    })
  }

  private generateSubpaymentFromPayment(payment: Payment): Payment {
    delete payment.processAmount
    return {
      ...payment,
      id: crypto.randomUUID()
    }
  }
}

export default TransactionStorageAPI
