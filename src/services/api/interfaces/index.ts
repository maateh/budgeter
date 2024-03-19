import { UUID } from "crypto"
import { z } from "zod"

// types
import { Budget, BudgetNote, Currencies, Pagination, PaginationParams, Transaction } from "@/services/api/types"

// validations
import { budgetSchema } from "@/components/form/budget/validations"
import { budgetNoteSchema } from "@/components/form/budget-note/validations"
import { transactionSchema } from "@/components/form/transaction/validations"

export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IBudgetAPI {
  getById(id: UUID): Promise<Budget>
  get(params?: PaginationParams, filterBy?: Partial<Budget>): Promise<Budget[]>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<Budget>>

  create(data: z.infer<typeof budgetSchema>): Promise<Budget>
  update(id: UUID, data: z.infer<typeof budgetSchema>): Promise<Budget>
  delete(id: UUID): Promise<Budget>
}

export interface IBudgetNoteAPI {
  getByIdWithBudget(budgetId: UUID, noteId: UUID): Promise<BudgetNote & { budget: Budget }>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<BudgetNote>>

  create(budgetId: UUID, data: z.infer<typeof budgetNoteSchema>): Promise<BudgetNote>
  updateText(budgetId: UUID, noteId: UUID, data: z.infer<typeof budgetNoteSchema>): Promise<BudgetNote>
  updateStatus(budgetId: UUID, noteId: UUID, status: BudgetNote['status']): Promise<BudgetNote>
  delete(budgetId: UUID, noteId: UUID): Promise<BudgetNote>
}

export interface ITransactionAPI {
  getByIdWithBudget(transactionId: UUID): Promise<Transaction & { budget: Budget }>
  get(params?: PaginationParams, filterBy?: Partial<Transaction>): Promise<Transaction[]>
  getPaginatedWithBudgets(params: PaginationParams, filterBy?: Partial<Transaction>): Promise<Pagination<Transaction & { budget: Budget }>>

  create(data: z.infer<typeof transactionSchema>, executePayment: boolean): Promise<Transaction>
  updateStatus(id: UUID, processed: boolean): Promise<Transaction>
  delete(id: UUID, undoPayment: boolean): Promise<Transaction>
}

export interface IBackupAPI {
  create(budgetIds?: UUID[]): Promise<string>
  restore(): Promise<unknown>
}
