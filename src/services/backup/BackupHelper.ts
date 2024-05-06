import { z } from "zod"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetStorageAPI, BudgetNoteStorageAPI, SubpaymentStorageAPI, TransactionStorageAPI } from '@/services/storage/collections'

// types
import { BudgetDocument, BudgetNoteDocument, SubpaymentDocument, TransactionDocument } from "@/services/storage/types"
import { BackupData, BackupFileContent } from "@/services/backup/types"

// interfaces
import { IBackupAPI } from "@/services/api/interfaces"

// validations
import { backupSchema } from "@/lib/validations"

// utils
import { filterObject } from "@/services/storage/utils"

class BackupHelper implements IBackupAPI {
  public static _instance: BackupHelper

  private budgetStorage: StorageHelper<BudgetDocument>
  private budgetNoteStorage: StorageHelper<BudgetNoteDocument>
  private transactionStorage: StorageHelper<TransactionDocument>
  private subpaymentStorage: StorageHelper<SubpaymentDocument>

  private constructor() {
    this.budgetStorage = BudgetStorageAPI.getInstance().getStorage()
    this.budgetNoteStorage = BudgetNoteStorageAPI.getInstance().getStorage()
    this.transactionStorage = TransactionStorageAPI.getInstance().getStorage()
    this.subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()
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
    const { budgets, transactions, subpayments, notes } = data

    if (complete) {
      await this.budgetStorage.saveToStorage(budgets)
      await this.budgetNoteStorage.saveToStorage(notes)
      await this.transactionStorage.saveToStorage(transactions)
      await this.subpaymentStorage.saveToStorage(subpayments)
      return
    }

    await this.budgetStorage.restore(budgets, {
      filterBy: { id: Object.keys(budgets) }
    })

    await this.budgetNoteStorage.restore(notes, {
      filterBy: { budgetId: Object.keys(budgets) }
    })

    await this.transactionStorage.restore(transactions, {
      filterBy: { budgetId: Object.keys(budgets) }
    })

    await this.subpaymentStorage.restore(subpayments, {
      filterBy: { budgetId: Object.keys(budgets) }
    })
  }

  // helpers
  private async collectData(complete: boolean, budgetIds: string[]): Promise<BackupData> {
    const budgets = await this.budgetStorage.fetchFromStorage()
    const notes = await this.budgetNoteStorage.fetchFromStorage()
    const transactions = await this.transactionStorage.fetchFromStorage()
    const subpayments = await this.subpaymentStorage.fetchFromStorage()

    if (complete) {
      return { budgets, notes, transactions, subpayments }
    }

    return {
      budgets: filterObject(budgets, (budget) => budgetIds.includes(budget.id)),
      notes: filterObject(notes, (note) => budgetIds.includes(note.budgetId)),
      transactions: filterObject(transactions, (tr) => budgetIds.includes(tr.budgetId)),
      subpayments: filterObject(subpayments, (subpayment) => budgetIds.includes(subpayment.budgetId))
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
