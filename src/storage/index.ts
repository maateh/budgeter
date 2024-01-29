// storages
import BudgetStorage from "@/storage/BudgetStorage"
import TransactionStorage from "@/storage/TransactionStorage"

class Storage {
  static budget = BudgetStorage
  static transaction = TransactionStorage
}

export default Storage
