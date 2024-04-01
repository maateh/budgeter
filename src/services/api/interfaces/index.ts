import { z } from "zod"

// types
import { Budget, BudgetNote, Currencies, Pagination, PaginationParams, Payment, Transaction } from "@/services/api/types"
import { BackupFileContent } from "@/services/backup/types"

// validations
import { backupSchema, budgetFormSchema, noteFormSchema, paymentFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IBudgetAPI {
  getById(id: string): Promise<Budget>
  get(params?: PaginationParams, filterBy?: Partial<Budget>): Promise<Budget[]>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<Budget>>

  create(data: z.infer<typeof budgetFormSchema>): Promise<Budget>
  update(id: string, data: z.infer<typeof budgetFormSchema>): Promise<Budget>
  delete(id: string): Promise<Budget>
}

export interface IBudgetNoteAPI {
  getByIdWithBudget(budgetId: string, noteId: string): Promise<BudgetNote & { budget: Budget }>
  getPaginated(params: PaginationParams, filterBy?: Partial<Budget>): Promise<Pagination<BudgetNote>>

  create(budgetId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote>
  updateText(budgetId: string, noteId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote>
  updateStatus(budgetId: string, noteId: string, status: BudgetNote['status']): Promise<BudgetNote>
  delete(budgetId: string, noteId: string): Promise<BudgetNote>
}

export interface ITransactionAPI {
  getByIdWithBudget(transactionId: string): Promise<Transaction & { budget: Budget }>
  get(params?: PaginationParams, filterBy?: Partial<Transaction>): Promise<Transaction[]>
  getPaginatedWithBudgets(params: PaginationParams, filterBy?: Partial<Transaction>): Promise<Pagination<Transaction & { budget: Budget }>>
  
  create(data: z.infer<typeof transactionFormSchema | typeof transferMoneyFormSchema>): Promise<Transaction>
  delete(id: string): Promise<Transaction>
  
  updateStatus(id: string, processed: boolean): Promise<Transaction>
  transferMoney(data: z.infer<typeof transferMoneyFormSchema>): Promise<{ rootTransaction: Transaction; targetTransaction: Transaction }>
}

export interface IPaymentAPI {
  get(params?: PaginationParams, filterBy?: Partial<Payment>): Promise<Pagination<Payment>>
  addSubpayment(transactionId: string, data: z.infer<typeof paymentFormSchema>): Promise<Transaction>
  removeSubpayment(transactionId: string, subpaymentId: string): Promise<Transaction>
}

export interface IBackupAPI {
  create(complete: boolean, budgetIds: string[]): Promise<{ downloadUrl: string, fileContent: BackupFileContent }>
  restore(backupFile: z.infer<typeof backupSchema>): Promise<void>
}
