import { z } from "zod"

// interfaces
import { IPaymentAPI } from "@/services/api/interfaces"

// types
import { Pagination, Payment, QueryOptions, Transaction } from "@/services/api/types"
import { PaymentDocument } from "@/services/storage/types"

// validations
import { subpaymentFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"

// helpers
import { updateTransaction } from "@/services/storage/helpers/transaction"

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

  public async get({ params, filter, sortBy }: QueryOptions<Payment> = {}): Promise<Pagination<Payment>> {
    const payments = await this.storage.find(filter)
    return paginate(payments, { params, sortBy })
  }

  public async addSubpayment(transactionId: string, data: z.infer<typeof subpaymentFormSchema>): Promise<Transaction> {  
    const subpayment: Payment = {
      ...data,
      id: crypto.randomUUID(),
      transactionId,
      createdAt: new Date(),
      isSubpayment: true
    }

    return await updateTransaction(transactionId, subpayment, 'execute')
  }

  public async removeSubpayment(transactionId: string, subpaymentId: string): Promise<Transaction> {
    const subpayment = await this.storage.findById(subpaymentId)

    if (!subpayment) {
      throw new Error('Subpayment not found!')
    }

    return await updateTransaction(transactionId, subpayment, 'undo')
  }

  public getStorage() {
    return this.storage
  }
}

export default PaymentStorageAPI
