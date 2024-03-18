import { UUID } from "crypto"
import { z } from "zod"

// types
import { Budget, BudgetNote, Currencies, Pagination, PaginationParams, Transaction } from "@/services/api/types"

// validations
import { BudgetNoteValidation, BudgetValidation, TransactionValidation } from "@/lib/validation"

export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IBudgetAPI {
  getById(id: UUID): Promise<Budget>
  get(params?: PaginationParams, filterBy?: Partial<Budget>): Promise<Budget[]>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<Budget>>

  create(data: z.infer<typeof BudgetValidation>): Promise<Budget>
  update(id: UUID, data: z.infer<typeof BudgetValidation>): Promise<Budget>
  delete(id: UUID): Promise<Budget>
}

export interface IBudgetNoteAPI {
  getByIdWithBudget(budgetId: UUID, noteId: UUID): Promise<BudgetNote & { budget: Budget }>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<BudgetNote>>

  create(budgetId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  updateText(budgetId: UUID, noteId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  updateStatus(budgetId: UUID, noteId: UUID, status: BudgetNote['status']): Promise<BudgetNote>
  delete(budgetId: UUID, noteId: UUID): Promise<BudgetNote>
}

export interface ITransactionAPI {
  getByIdWithBudget(transactionId: UUID): Promise<Transaction & { budget: Budget }>
  get(params?: PaginationParams, filterBy?: Partial<Transaction>): Promise<Transaction[]>
  getPaginatedWithBudgets(params: PaginationParams, filterBy?: Partial<Transaction>): Promise<Pagination<Transaction & { budget: Budget }>>

  create(data: z.infer<typeof TransactionValidation>, executePayment: boolean): Promise<Transaction>
  updateStatus(id: UUID, processed: boolean): Promise<Transaction>
  delete(id: UUID, undoPayment: boolean): Promise<Transaction>
}

export interface IBackupAPI {
  create(budgetIds?: UUID[]): Promise<string>
  restore(): Promise<unknown>
}
