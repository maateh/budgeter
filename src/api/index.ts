// storage
import BudgetStorage from '@/api/storage/BudgetStorage'
import TransactionStorage from '@/api/storage/TransactionStorage'

class API {  
  // TODO: implement remote api calls when there will be an external db

  static budget = BudgetStorage.getInstance()
  static transaction = TransactionStorage.getInstance()
}

export default API
