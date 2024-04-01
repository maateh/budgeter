import { z } from "zod"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"
import BudgetNoteStorageAPI from "@/services/storage/BudgetNoteStorageAPI"
import TransactionStorageAPI from "@/services/storage/TransactionStorageAPI"
import PaymentStorageAPI from "@/services/storage/PaymentStorageAPI"

// types
import { Budget, BudgetNote, Payment } from "@/services/api/types"
import { TransactionDocument } from "@/services/storage/types"
import { BackupData, BackupFileContent } from "@/services/backup/types"

// interfaces
import { IBackupAPI } from "@/services/api/interfaces"

// validations
import { backupSchema } from "@/lib/validations"

// utils
import { filterObject } from "@/utils"

class BackupHelper implements IBackupAPI {
  public static _instance: BackupHelper

  private budgetStorage: StorageHelper<Budget>
  private budgetNoteStorage: StorageHelper<BudgetNote>
  private transactionStorage: StorageHelper<TransactionDocument>
  private paymentStorage: StorageHelper<Payment>

  private constructor() {
    this.budgetStorage = BudgetStorageAPI.getInstance().getStorage()
    this.budgetNoteStorage = BudgetNoteStorageAPI.getInstance().getStorage()
    this.transactionStorage = TransactionStorageAPI.getInstance().getStorage()
    this.paymentStorage = PaymentStorageAPI.getInstance().getStorage()
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new BackupHelper()
    }
    return this._instance
  }

  public async create(complete: boolean, budgetIds: string[]): Promise<{ downloadUrl: string, fileContent: BackupFileContent }> {
    const data = await this.collectData(complete, budgetIds)
    const fileContent = this.convertToFileContent(data, complete)
    const file = this.generateFile(fileContent)
    
    return {
      downloadUrl: URL.createObjectURL(file),
      fileContent
    }
  }

  public async restore({ fileContent }: z.infer<typeof backupSchema>): Promise<void> {
    const { data, complete } = fileContent
    const { budgets, transactions, payments, notes } = data

    if (complete) {
      await this.budgetStorage.saveToStorage(budgets)
      await this.transactionStorage.saveToStorage(transactions)
      await this.paymentStorage.saveToStorage(payments)
      await this.budgetNoteStorage.saveToStorage(notes)
      return
    }

    await this.budgetStorage.restore(budgets,
      (budget) => Object.keys(budgets).some((key) => key === budget.id))

    await this.transactionStorage.restore(transactions,
      (tr) => Object.values(budgets).some((budget) => budget.id === tr.id))

    await this.paymentStorage.restore(payments,
      (payment) => Object.values(budgets).some((budget) => budget.id === payment.id))

    await this.budgetNoteStorage.restore(notes,
      (note) => Object.values(budgets).some((budget) => budget.id === note.id))
  }

  // helpers
  private async collectData(complete: boolean, budgetIds: string[]): Promise<BackupData> {
    const budgets = await this.budgetStorage.fetchFromStorage()
    const notes = await this.budgetNoteStorage.fetchFromStorage()
    const transactions = await this.transactionStorage.fetchFromStorage()
    const payments = await this.paymentStorage.fetchFromStorage()

    if (complete) {
      return { budgets, notes, transactions, payments }
    }

    return {
      budgets: filterObject(budgets, (budget) => budgetIds.includes(budget.id)),
      notes: filterObject(notes, (note) => budgetIds.includes(note.budgetId)),
      transactions: filterObject(transactions, (tr) => budgetIds.includes(tr.budgetId)),
      payments: filterObject(payments, (payment) => budgetIds.includes(payment.budgetId))
    }
  }

  private convertToFileContent(data: BackupData, complete: boolean): BackupFileContent {
    return {
      version: 0.1,
      backup_date: new Date(),
      complete,
      data
    }
  }

  private generateFile(backup: BackupFileContent): File {   
    return new File([JSON.stringify(backup)], 'backup.json', {
      type: 'application/json'
    })
  }
}

export default BackupHelper
