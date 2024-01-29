// types
import { ModelCollection } from "@/types"
import Transaction from "@/models/Transaction"

class TransactionAPI {
  static async findAll(): Promise<ModelCollection['transaction']> {
    // TODO: localStorage -> Storage.transaction.findAll()
  }

  static async findByBudget(budgetId: string): Promise<ModelCollection['transaction']> {
    // TODO: localStorage -> Storage.transaction.findByBudget(budgetId)
  }
  
  static async find(id: string): Promise<Transaction> {
    // TODO: localStorage -> Storage.transaction.find(id)
  }
  
  static async bulkSave(transactions: ModelCollection['transaction']) {
    // TODO: localStorage -> Storage.transaction.bulkSave(transactions)
  }
  
  static async save(transaction: Transaction) {
    // TODO: localStorage -> Storage.transaction.save(transaction.id, transaction)
  }
  
  static async bulkDelete(ids: string[]) {
    // TODO: localStorage -> Storage.transaction.bulkDelete(ids)
  }
  
  static async delete(id: string) {
    // TODO: localStorage -> Storage.transaction.delete(id)
  }
}

export default TransactionAPI
