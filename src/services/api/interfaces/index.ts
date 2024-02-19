// types
import { Currencies, ModelCollection } from "@/types"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IBudgetAPI {
  findAll(): Promise<ModelCollection['budget']>
  find(id: string): Promise<Budget>

  bulkSave(models: ModelCollection['budget']): Promise<ModelCollection['budget']>
  save(model: Budget): Promise<Budget>

  bulkDelete(ids: string[]): Promise<void>
  delete(id: string): Promise<void>

  addTransactions(budgetId: string, transactions: Transaction[]): Promise<Budget>
  deleteTransactions(budgetId: string, transactionIds: string[]): Promise<Budget>
}

export interface ITransactionAPI {
  findAll(): Promise<ModelCollection['transaction']>
  findByBudget(budgetId: string): Promise<ModelCollection['transaction']>
  find(id: string): Promise<Transaction>
  
  bulkSave(budgetId: string, models: ModelCollection['transaction']): Promise<ModelCollection['transaction']>
  save(model: Transaction): Promise<Transaction>
  
  bulkDelete(budgetId: string, ids: string[]): Promise<void>
  delete(id: string): Promise<void>
}
