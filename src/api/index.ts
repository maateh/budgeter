// api
import BudgetAPI from '@/api/budgets'
import TransactionAPI from '@/api/transactions'

// storage
import Storage from '@/storage'

class API {
  static useStorage = true

  static budget = this.useStorage ? Storage.budget : BudgetAPI
  static transaction = this.useStorage ? Storage.transaction : TransactionAPI
}

export default API
