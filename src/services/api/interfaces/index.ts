import { UUID } from "crypto"
import { ZodType, z } from "zod"

// types
import { Budget, BudgetNote, Transaction } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"
import { Currencies, /*ModelCollection*/ } from "@/types"

// validations
import { BudgetNoteValidation } from "@/lib/validation"

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

export interface INewBudgetAPI extends IAPI<Budget> {
  addNote(budgetId: UUID, text: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  editNoteText(budgetId: UUID, noteId: UUID, text: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  removeNote(budgetId: UUID, noteId: UUID): Promise<void>
  changeNoteStatus(budgetId: UUID, noteId: UUID, status: 'open' | 'closed'): Promise<BudgetNote>
}

export interface INewTransactionAPI extends IAPI<Transaction> {
  getByBudget(budgetId: UUID): Promise<StorageCollection<Transaction>>
  deleteByBudget(budgetId: UUID): Promise<void>
  bulkDelete(ids: UUID[]): Promise<void>

  changeStatus(id: UUID, status: 'processed' | 'processing'): Promise<Transaction>
}

// export interface ITransactionAPI {
//   findAll(): Promise<ModelCollection['transaction']>
//   findByBudget(budgetId: string): Promise<ModelCollection['transaction']>
//   find(id: string): Promise<Transaction>
  
//   bulkSave(budgetId: string, models: ModelCollection['transaction']): Promise<ModelCollection['transaction']>
//   save(model: Transaction): Promise<Transaction>
  
//   bulkDelete(ids: string[], budgetId?: string): Promise<void>
//   delete(id: string): Promise<void>
// }
