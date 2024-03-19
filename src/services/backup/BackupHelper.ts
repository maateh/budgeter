import { z } from "zod"

// storage
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"
import BudgetNoteStorageAPI from "@/services/storage/BudgetNoteStorageAPI"
import TransactionStorageAPI from "@/services/storage/TransactionStorageAPI"

// types
import { BackupData, BackupFormat } from "@/services/backup/types"

// interfaces
import { IBackupAPI } from "@/services/api/interfaces"

// validations
import { backupFileSchema } from "@/components/form/backup/validations"

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

  public async create(budgetIds?: string[]): Promise<string> {
    const data = await this.dataCollector(budgetIds)
    const file = this.generateFile(data, !!budgetIds)
    return URL.createObjectURL(file)
  }

  public async restore({ fileContent }: z.infer<typeof backupFileSchema>): Promise<void> {
    const { data, complete } = fileContent

    // WIP

    if (complete) {
      const { budgets, transactions, notes } = data

      await this.budgetStorageApi.getStorage().saveToStorage(budgets)
      await this.transactionStorageApi.getStorage().saveToStorage(transactions)
      await this.budgetNoteStorageApi.getStorage().saveToStorage(notes)
      return
    }

    // TODO: restore logic
    // await this.budgetStorageApi.getStorage()
    //   .bulkDelete((doc) => Object.keys(data.budgets).some((key) => key === doc.id))

    // await this.budgetStorageApi.getStorage().saveToStorage
  }

  // helpers
  private async dataCollector(budgetIds?: string[]): Promise<BackupData> {
    const budgets = await this.budgetStorageApi.getStorage().fetchFromStorage()
    const notes = await this.budgetNoteStorageApi.getStorage().fetchFromStorage()
    const transactions = await this.transactionStorageApi.getStorage().fetchFromStorage()

    // TODO: filter by budgetIds

    return { budgets, transactions, notes }
  }

  private generateFile(data: BackupData, complete: boolean): File {
    const backup: BackupFormat = {
      version: 0.1,
      backup_date: new Date(),
      complete,
      data
    }
    
    return new File([JSON.stringify(backup)], 'backup.json', {
      type: 'application/json'
    })
  }
}

export default BackupHelper
