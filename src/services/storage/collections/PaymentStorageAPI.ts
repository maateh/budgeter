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
      ({ createdAt: a }, { createdAt: b }) => a < b ? 1 : -1
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

/**
 * Manages a payment within a transaction by updating the payment details, processing status,
 * and triggering balance management for the associated budget.
 *
 * @param transactionId - The ID of the transaction to which the payment belongs.
 * @param payment - The payment object to be managed.
 * @param action - The action to be performed: 'execute' to apply the payment or 'undo' to revert it.
 * @returns A Promise resolving to the updated transaction after managing the payment.
 */
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
 * Manages a subpayment within a transaction by updating the subpayment details, processing status,
 * and triggering balance management for the associated budget.
 *
 * @param transactionId - The ID of the transaction to which the subpayment belongs.
 * @param subpayment - The subpayment object to be managed.
 * @param action - The action to be performed: 'execute' to apply the subpayment or 'undo' to revert it.
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
