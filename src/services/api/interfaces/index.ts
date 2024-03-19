import { z } from "zod"

// types
import { Budget, BudgetNote, Currencies, Pagination, PaginationParams, Transaction } from "@/services/api/types"

// validations
import { budgetSchema } from "@/components/form/budget/validation"
import { budgetNoteSchema } from "@/components/form/budget-note/validations"
import { transactionSchema } from "@/components/form/transaction/validations"
import { backupFileSchema } from "@/components/form/backup/validations"

export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IBudgetAPI {
  getById(id: string): Promise<Budget>
  get(params?: PaginationParams, filterBy?: Partial<Budget>): Promise<Budget[]>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<Budget>>

  create(data: z.infer<typeof budgetSchema>): Promise<Budget>
  update(id: string, data: z.infer<typeof budgetSchema>): Promise<Budget>
  delete(id: string): Promise<Budget>
}

export interface IBudgetNoteAPI {
  getByIdWithBudget(budgetId: string, noteId: string): Promise<BudgetNote & { budget: Budget }>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<BudgetNote>>

  create(budgetId: string, data: z.infer<typeof budgetNoteSchema>): Promise<BudgetNote>
  updateText(budgetId: string, noteId: string, data: z.infer<typeof budgetNoteSchema>): Promise<BudgetNote>
  updateStatus(budgetId: string, noteId: string, status: BudgetNote['status']): Promise<BudgetNote>
  delete(budgetId: string, noteId: string): Promise<BudgetNote>
}

export interface ITransactionAPI {
  getByIdWithBudget(transactionId: string): Promise<Transaction & { budget: Budget }>
  get(params?: PaginationParams, filterBy?: Partial<Transaction>): Promise<Transaction[]>
  getPaginatedWithBudgets(params: PaginationParams, filterBy?: Partial<Transaction>): Promise<Pagination<Transaction & { budget: Budget }>>

  create(data: z.infer<typeof transactionSchema>, executePayment: boolean): Promise<Transaction>
  updateStatus(id: string, processed: boolean): Promise<Transaction>
  delete(id: string, undoPayment: boolean): Promise<Transaction>
}

export interface IBackupAPI {
  create(budgetIds?: string[]): Promise<string>
  restore(backupFile: z.infer<typeof backupFileSchema>): Promise<void>
}
