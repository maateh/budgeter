import { UUID } from "crypto"
import { ZodType, z } from "zod"

// types
import { BudgetDocument, BudgetNoteDocument } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"
import { Currencies, ModelCollection } from "@/types"

// validations
import { BudgetNoteValidation } from "@/lib/validation"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"


export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IAPI<D> {
  get(id: UUID): Promise<D>
  getAll(): Promise<StorageCollection<D>>

  create<V extends ZodType>(data: z.infer<V>): Promise<D>
  update<V extends ZodType>(id: UUID, data: z.infer<V>): Promise<D>

  delete(id: UUID): Promise<void>
}

export interface INewBudgetAPI extends IAPI<BudgetDocument> {
  addNote(budgetId: UUID, text: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNoteDocument>
  editNoteText(budgetId: UUID, noteId: UUID, text: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNoteDocument>
  removeNote(budgetId: UUID, noteId: UUID): Promise<void>
  changeNoteStatus(budgetId: UUID, noteId: UUID, status: 'open' | 'closed'): Promise<BudgetNoteDocument>
}

export interface INewTransactionAPI extends IAPI<Transaction> {
  getByBudget(budgetId: UUID): Promise<StorageCollection<Transaction>>
  deleteByBudget(budgetId: UUID): Promise<void>
  bulkDelete(ids: UUID[]): Promise<void>

  changeStatus(id: UUID, status: 'processed' | 'processing'): Promise<Transaction>
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
  
  bulkDelete(ids: string[], budgetId?: string): Promise<void>
  delete(id: string): Promise<void>
}
