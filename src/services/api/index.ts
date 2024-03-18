// api
import CurrencyAPI from '@/services/api/CurrencyAPI'

// storage
import BudgetStorageAPI from '@/services/storage/BudgetStorageAPI'
import BudgetNoteStorageAPI from '@/services/storage/BudgetNoteStorageAPI'
import TransactionStorageAPI from '@/services/storage/TransactionStorageAPI'
import BackupHelper from '@/services/backup/BackupHelper'

// interfaces
import { IBackupAPI, IBudgetAPI, IBudgetNoteAPI, ITransactionAPI } from '@/services/api/interfaces'

class API {
  private static _instance: API

  public currency: CurrencyAPI
  public budget: IBudgetAPI
  public budgetNote: IBudgetNoteAPI
  public transaction: ITransactionAPI
  public backup: IBackupAPI

  private constructor(type: 'storage' | 'remote') {
    this.currency = CurrencyAPI.getInstance()

    if (type === 'storage') {
      this.budget = BudgetStorageAPI.getInstance()
      this.budgetNote = BudgetNoteStorageAPI.getInstance()
      this.transaction = TransactionStorageAPI.getInstance()
      this.backup = BackupHelper.getInstance()
    } else {
      // TODO: create remote api
      this.budget = BudgetStorageAPI.getInstance()
      this.budgetNote = BudgetNoteStorageAPI.getInstance()
      this.transaction = TransactionStorageAPI.getInstance()
      this.backup = BackupHelper.getInstance()
    }
  }

  public static getInstance(type: 'storage' | 'remote') {
    if (!API._instance) {
      API._instance = new API(type)
    }
    return API._instance
  }
}

export default API
