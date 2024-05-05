// api
import CurrencyAPI from '@/services/api/CurrencyAPI'

// storage
import { BudgetStorageAPI, BudgetNoteStorageAPI, SubpaymentStorageAPI, TransactionStorageAPI } from '@/services/storage/collections'
import BackupHelper from '@/services/backup/BackupHelper'

// interfaces
import { IBackupAPI, IBudgetAPI, IBudgetNoteAPI, ISubpaymentAPI, ITransactionAPI } from '@/services/api/interfaces'

class API {
  private static _instance: API

  public currency: CurrencyAPI
  public budget: IBudgetAPI
  public budgetNote: IBudgetNoteAPI
  public transaction: ITransactionAPI
  public payment: ISubpaymentAPI
  public backup: IBackupAPI

  private constructor(type: 'storage' | 'remote') {
    this.currency = CurrencyAPI.getInstance()

    if (type === 'storage') {
      this.budget = BudgetStorageAPI.getInstance()
      this.budgetNote = BudgetNoteStorageAPI.getInstance()
      this.transaction = TransactionStorageAPI.getInstance()
      this.payment = SubpaymentStorageAPI.getInstance()
      this.backup = BackupHelper.getInstance()
    } else {
      /**
       * NOTE: If a separate API is created for 'Budgeter',
       * the corresponding calls can be implemented here.
       */

      this.budget = BudgetStorageAPI.getInstance()
      this.budgetNote = BudgetNoteStorageAPI.getInstance()
      this.transaction = TransactionStorageAPI.getInstance()
      this.payment = SubpaymentStorageAPI.getInstance()
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
