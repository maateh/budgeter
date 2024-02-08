// api
import CurrencyAPI from '@/services/api/CurrencyAPI'

// storage
import BudgetStorage from '@/services/storage/BudgetStorage'
import TransactionStorage from '@/services/storage/TransactionStorage'

class API {
  private static _instance: API

  public currency: CurrencyAPI
  public budget: BudgetStorage
  public transaction: TransactionStorage

  private constructor(type: 'storage' | 'remote') {
    this.currency = CurrencyAPI.getInstance()

    if (type === 'storage') {
      this.budget = BudgetStorage.getInstance()
      this.transaction = TransactionStorage.getInstance()
    } else {
      // TODO: create remote api
      this.budget = BudgetStorage.getInstance()
      this.transaction = TransactionStorage.getInstance()
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