import { UUID } from "crypto"
import { z } from "zod"

// interfaces
import { INewTransactionAPI } from "@/services/api/interfaces"

// types
import { Transaction } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

// storage
import StorageHelper from "@/services/storage/StorageHelper"

// validations
import { TransactionValidation } from "@/lib/validation"

class TransactionStorageAPI implements INewTransactionAPI {
  private static _instance: TransactionStorageAPI
  private storage: StorageHelper<Transaction>

  private constructor() {
    this.storage = new StorageHelper()
  }

  public static getInstance(): TransactionStorageAPI {
    if (!TransactionStorageAPI._instance) {
      TransactionStorageAPI._instance = new TransactionStorageAPI()
    }
    return TransactionStorageAPI._instance
  }

  async get(id: UUID): Promise<Transaction> {
    return await this.storage.findById('transactions', id)
  }

  async getByBudget(budgetId: UUID): Promise<StorageCollection<Transaction>> {
    const transactions = await this.storage.find('transactions')
    return Object.values(transactions)
      .filter(tr => tr.budgetId === budgetId)
      .reduce((transactions, tr) => ({
        ...transactions,
        [tr.id]: tr
      }), {})
  }

  async getAll(): Promise<StorageCollection<Transaction>> {
    return await this.storage.find('transactions')
  }

  async create(data: z.infer<typeof TransactionValidation>): Promise<Transaction> {
    const currentDate = new Date()
    const date: Transaction['date'] = {
      created: currentDate,
      expected: currentDate,
      credited: currentDate
    }
  
    if (data.status as Transaction['status'] === 'processing' && data.expectedDate) {
      date.credited = undefined
      date.expected = data.expectedDate
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      budgetId: data.budgetId as UUID,
      type: 'default',
      status: data.status as Transaction['status'],
      payment: data.payment as Transaction['payment'],
      date
    }

    // TODO: execute payment changes on budget balance

    return await this.storage.save('transactions', transaction)
  }

  async update(_id: UUID, _data: z.infer<typeof TransactionValidation>): Promise<Transaction> {
    // TODO: not sure if this is necessary
    throw new Error("Method not implemented.")
  }

  async delete(id: UUID): Promise<void> {
    // TODO: execute payment changes on budget balance
    await this.storage.delete('transactions', id)
  }

  async deleteByBudget(budgetId: UUID): Promise<void> {
    const transactions = await this.storage.find('transactions')
    const ids = Object.values(transactions)
      .filter(tr => tr.budgetId === budgetId)
      .map(tr => tr.id)

    // TODO: execute payment changes on budget balance
    await this.storage.bulkDelete('transactions', ids)
  }

  async changeStatus(id: UUID, status: Transaction['status']): Promise<Transaction> {
    const transaction = await this.storage.findById('transactions', id)
    
    transaction.status = status
    // TODO: execute payment changes on budget balance

    return await this.storage.save('transactions', transaction)
  }
}

export default TransactionStorageAPI
