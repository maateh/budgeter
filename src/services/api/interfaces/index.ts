// types
import { Currencies, ModelCollection } from "@/types"
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

export interface ICurrencyAPI {
  get(): Currencies
}

export interface IBudgetAPI {
  findAll(): Promise<ModelCollection['budget']>
  find(id: string): Promise<Budget>

  bulkSave(models: ModelCollection['budget']): Promise<ModelCollection['budget']>
  save(model: Budget): Promise<Budget>

  bulkDelete(ids: string[]): Promise<boolean>
  delete(id: string): Promise<boolean>

  addTransactions(budgetId: string, transactions: Transaction[]): Promise<Budget>
  deleteTransactions(budgetId: string, transactionIds: string[]): Promise<Budget>
}

export interface ITransactionAPI {
  findAll(): Promise<ModelCollection['transaction']>
  findByBudget(budgetId: string): Promise<ModelCollection['transaction']>
  find(id: string): Promise<Transaction>
  
  bulkSave(models: ModelCollection['transaction']): Promise<ModelCollection['transaction']>
  save(model: Transaction): Promise<Transaction>
  
  bulkDelete(ids: string[]): Promise<boolean>
  delete(id: string): Promise<boolean>
}
