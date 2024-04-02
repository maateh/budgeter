import { z } from "zod"

// interfaces
import { IPaymentAPI } from "@/services/api/interfaces"

// types
import { Pagination, Payment, QueryOptions, Transaction } from "@/services/api/types"
import { PaymentDocument } from "@/services/storage/types"

// validations
import { paymentFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// utils
import { paginate } from "@/services/storage/utils"

class PaymentStorageAPI implements IPaymentAPI {
  private static _instance: PaymentStorageAPI

  private storage: StorageHelper<PaymentDocument>

  private constructor() {
    this.storage = new StorageHelper('payments')
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new PaymentStorageAPI()
    }
    return this._instance
  }

  public async get({ params, filter }: QueryOptions<Payment> = {}): Promise<Pagination<Payment>> {
    const payments = await this.storage.find(filter)

    return paginate(
      payments, params,
      ({ createdAt: a }, { createdAt: b }) => Date.parse(a.toString()) < Date.parse(b.toString()) ? 1 : -1
    )
  }

  public async addSubpayment(transactionId: string, data: z.infer<typeof paymentFormSchema>): Promise<Transaction> {
    const { budgetId } = await TransactionStorageAPI.getInstance()
      .getStorage().findById(transactionId)
    
    const subpayment: Payment = {
      ...data,
      id: crypto.randomUUID(),
      budgetId,
      transactionId,
      createdAt: new Date(),
      isSubpayment: true
    }

    return await this.manageSubpayment(transactionId, subpayment, 'execute')
  }

  public async removeSubpayment(transactionId: string, subpaymentId: string): Promise<Transaction> {
    const subpayment = await this.storage.findById(subpaymentId)

    if (!subpayment) {
      throw new Error('Subpayment not found!')
    }

    return await this.manageSubpayment(transactionId, subpayment, 'undo')
  }

  // helpers
  public getStorage() {
    return this.storage
  }

  public async managePayment(transactionId: string, payment: Payment, action: 'execute' | 'undo'): Promise<Transaction> {
    const budgetApi = BudgetStorageAPI.getInstance()
    const transactionStorage = TransactionStorageAPI.getInstance().getStorage()

    const { budgetId, ...doc } = await transactionStorage.findById(transactionId)
    
    if (action === 'execute') {
      payment = await this.storage.save({
        ...payment,
        processedAmount: payment.amount
      })
    }

    if (action === 'undo') {
      payment = await this.storage.save({
        ...payment,
        processedAmount: 0
      })
    }
    
    await budgetApi.manageBalance(budgetId, payment, action)

    const processed = (payment.processedAmount || 0) >= payment.amount
    const date = new Date()

    const transaction = await transactionStorage.save({
      ...doc, budgetId,
      processed,
      processedAt: processed ? date : undefined,
      updatedAt: date
    })

    return { ...transaction, budgetId, payment }
  }

/**
 * Manages subpayment execution within a transaction.
 * @param transaction - The transaction object containing the payment information.
 * @param subpayment - The subpayment to manage within the transaction.
 * @param action - The action to perform on the subpayment ('execute' or 'undo').
 * @returns A Promise resolving to the updated transaction after managing the subpayment.
 */
  public async manageSubpayment(transactionId: string, subpayment: Payment, action: 'execute' | 'undo'): Promise<Transaction> {
    const budgetApi = BudgetStorageAPI.getInstance()
    const transactionStorage = TransactionStorageAPI.getInstance().getStorage()

    const { budgetId, paymentId, ...doc } = await transactionStorage.findById(transactionId)

    let { processedAmount = 0, ...payment } = await this.storage.findById(paymentId)

    if (action === 'execute') {
      processedAmount += subpayment.amount
      await this.storage.save(subpayment)
    }

    if (action === 'undo') {
      processedAmount -= subpayment.amount
      await this.storage.deleteById(subpayment.id)
    }

    const processed = processedAmount >= payment.amount
    const date = new Date()

    await budgetApi.manageBalance(budgetId, subpayment, action)

    payment = await this.storage.save({ ...payment, processedAmount })
    const transaction = await transactionStorage.save({
      ...doc,
      budgetId,
      paymentId,
      processed,
      processedAt: processed ? date : undefined,
      updatedAt: date
    })

    return { ...transaction, budgetId, payment }
  }
}

export default PaymentStorageAPI
