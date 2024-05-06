import { z } from "zod"

// interfaces
import { ISubpaymentAPI } from "@/services/api/interfaces"

// types
import { Pagination, QueryOptions, Subpayment, Transaction } from "@/services/api/types"
import { SubpaymentDocument } from "@/services/storage/types"

// validations
import { subpaymentFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"

// helpers
import { updateTransaction } from "@/services/storage/helpers/transaction"

// utils
import { paginate } from "@/services/storage/utils"

class SubpaymentStorageAPI implements ISubpaymentAPI {
  private static _instance: SubpaymentStorageAPI

  private storage: StorageHelper<SubpaymentDocument>

  private constructor() {
    this.storage = new StorageHelper('subpayments')
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new SubpaymentStorageAPI()
    }
    return this._instance
  }

  public async get({ params, filter, sortBy }: QueryOptions<Subpayment> = {}): Promise<Pagination<Subpayment>> {
    const payments = await this.storage.find(filter)
    return paginate(payments, { params, sortBy })
  }

  public async addSubpayment(transactionId: string, data: z.infer<typeof subpaymentFormSchema>): Promise<Transaction> {  
    const { budgetId, type, amount } = data

    const subpayment = await this.storage.save({
      id: crypto.randomUUID(),
      budgetId,
      transactionId,
      type,
      amount,
      createdAt: new Date()
    })

    return await updateTransaction(transactionId, subpayment, 'execute')
  }

  public async removeSubpayment(transactionId: string, subpaymentId: string): Promise<Transaction> {
    const subpayment = await this.storage.findById(subpaymentId)

    if (!subpayment) {
      throw new Error('Subpayment not found!')
    }

    if (subpayment.isBorrowmentRoot) {
      throw new Error('You cannot remove a root subpayment.')
    }

    await this.storage.deleteById(subpaymentId)
    return await updateTransaction(transactionId, subpayment, 'undo')
  }

  public getStorage() {
    return this.storage
  }
}

export default SubpaymentStorageAPI
