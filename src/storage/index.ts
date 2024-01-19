// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// storages
import BudgetStorage from "./BudgetStorage"

export type StorageData = {
  budget: {[key: string]: Budget},
  transaction: {[key: string]: Transaction}
}

class Storage {
  static budget = BudgetStorage
}

export default Storage
