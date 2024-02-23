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
import BudgetStorageAPI from "./BudgetStorageAPI"

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

  async getByBudget(budgetId: UUID, status?: Transaction['status']): Promise<StorageCollection<Transaction>> {
    const transactions = await this.storage.find('transactions')

    return Object.values(transactions)
      .filter(tr => status
          ? tr.budgetId === budgetId && tr.status == status
          : tr.budgetId === budgetId
      )
      .reduce((transactions, tr) => ({
        ...transactions,
        [tr.id]: tr
      }), {})
  }

  async getAll(status?: Transaction['status']): Promise<StorageCollection<Transaction>> {
    let transactions = await this.storage.find('transactions')

    if (status) {
      transactions = Object.values(transactions)
        .filter(tr => tr.status === status)
        .reduce((transactions, tr) => ({
          ...transactions,
          [tr.id]: tr
        }), {})
    }

    return transactions
  }

  async create(data: z.infer<typeof TransactionValidation>, executeOnBudget: boolean = true): Promise<Transaction> {
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

    if (executeOnBudget) {
      await BudgetStorageAPI.getInstance()
        .executePayments(transaction.budgetId, [transaction.payment])
    }

    return await this.storage.save('transactions', transaction)
  }

  async update(_id: UUID, _data: z.infer<typeof TransactionValidation>): Promise<Transaction> {
    // TODO: not sure if this is necessary
    throw new Error("Method not implemented.")
  }

  async delete(id: UUID, undoOnBudget: boolean = true): Promise<void> {
    const transaction = await this.storage.findById('transactions', id)

    if (undoOnBudget) {
      await BudgetStorageAPI.getInstance()
        .undoPayments(transaction.budgetId, [transaction.payment])
    }

    await this.storage.delete('transactions', id)
  }

  async deleteByBudget(budgetId: UUID, undoOnBudget: boolean = true): Promise<void> {
    const transactions = await this.storage.find('transactions')
    const budgetTransactions = Object.values(transactions)
      .filter(tr => tr.budgetId === budgetId)

    if (undoOnBudget) {
      const payments = budgetTransactions.map(tr => tr.payment)
      await BudgetStorageAPI.getInstance()
        .undoPayments(budgetId, payments)
    }
      
    const ids = budgetTransactions.map(tr => tr.id)
    await this.storage.bulkDelete('transactions', ids)
  }

  async changeStatus(id: UUID, status: Transaction['status']): Promise<Transaction> {
    const transaction = await this.storage.findById('transactions', id)
    
    transaction.status = status
    
    if (status === 'processed') {
      await BudgetStorageAPI.getInstance()
        .executePayments(transaction.budgetId, [transaction.payment])
    }

    if (status === 'processing') {
      await BudgetStorageAPI.getInstance()
        .undoPayments(transaction.budgetId, [transaction.payment])
    }

    return await this.storage.save('transactions', transaction)
  }
}

export default TransactionStorageAPI
