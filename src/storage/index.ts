// storages
import BudgetStorage from "./BudgetStorage"
import TransactionStorage from "./TransactionStorage"

class Storage {
  static budget = BudgetStorage
  static transaction = TransactionStorage
}

export default Storage
