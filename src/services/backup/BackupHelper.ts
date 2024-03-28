import { z } from "zod"

// storage
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"
import BudgetNoteStorageAPI from "@/services/storage/BudgetNoteStorageAPI"
import TransactionStorageAPI from "@/services/storage/TransactionStorageAPI"

// types
import { BackupData, BackupFileContent } from "@/services/backup/types"

// interfaces
import { IBackupAPI } from "@/services/api/interfaces"

// validations
import { backupSchema } from "@/lib/validations"

// utils
import { filterObject } from "@/utils"

class BackupHelper implements IBackupAPI {
  public static _instance: BackupHelper

  private budgetStorageApi: BudgetStorageAPI
  private budgetNoteStorageApi: BudgetNoteStorageAPI
  private transactionStorageApi: TransactionStorageAPI

  private constructor() {
    this.budgetStorageApi = BudgetStorageAPI.getInstance()
    this.budgetNoteStorageApi = BudgetNoteStorageAPI.getInstance()
    this.transactionStorageApi = TransactionStorageAPI.getInstance()
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
    const { budgets, transactions, notes } = data

    if (complete) {
      await this.budgetStorageApi.getStorage().saveToStorage(budgets)
      await this.transactionStorageApi.getStorage().saveToStorage(transactions)
      await this.budgetNoteStorageApi.getStorage().saveToStorage(notes)
      return
    }

    await this.budgetStorageApi.getStorage()
      .restore(budgets,
        (budget) => Object.keys(budgets).some((key) => key === budget.id)
      )

    await this.transactionStorageApi.getStorage()
      .restore(transactions,
        (tr) => Object.values(budgets).some((budget) => budget.id === tr.id)
      )

    await this.budgetNoteStorageApi.getStorage()
      .restore(notes,
        (note) => Object.values(budgets).some((budget) => budget.id === note.id)
      )
  }

  // helpers
  private async collectData(complete: boolean, budgetIds: string[]): Promise<BackupData> {
    const budgets = await this.budgetStorageApi.getStorage().fetchFromStorage()
    const notes = await this.budgetNoteStorageApi.getStorage().fetchFromStorage()
    const transactions = await this.transactionStorageApi.getStorage().fetchFromStorage()

    if (complete) {
      return { budgets, transactions, notes }
    }

    return {
      budgets: filterObject(budgets, (budget) => budgetIds.includes(budget.id)),
      transactions: filterObject(transactions, (tr) => budgetIds.includes(tr.budgetId)),
      notes: filterObject(notes, (note) => budgetIds.includes(note.budgetId)),
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
