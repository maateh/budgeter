import { z } from "zod"

// types
import { Budget, BudgetNote, Currencies, Pagination, Payment, QueryOptions, Transaction } from "@/services/api/types"
import { BackupFileContent } from "@/services/backup/types"

// validations
import { backupSchema, budgetFormSchema, noteFormSchema, paymentFormSchema, relatedTransactionsFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IBudgetAPI {
  getById(id: string): Promise<Budget>
  get(options?: QueryOptions<Budget>): Promise<Pagination<Budget>>

  create(data: z.infer<typeof budgetFormSchema>): Promise<Budget>
  update(id: string, data: z.infer<typeof budgetFormSchema>): Promise<Budget>
  delete(id: string): Promise<Budget>
}

export interface IBudgetNoteAPI {
  getByIdWithBudget(budgetId: string, noteId: string): Promise<BudgetNote & { budget: Budget }>
  get(options?: QueryOptions<BudgetNote>): Promise<Pagination<BudgetNote>>

  create(budgetId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote>
  updateText(budgetId: string, noteId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote>
  updateStatus(budgetId: string, noteId: string, status: BudgetNote['status']): Promise<BudgetNote>
  delete(budgetId: string, noteId: string): Promise<BudgetNote>
}

export interface ITransactionAPI {
  getByIdWithBudget(id: string): Promise<Transaction & { budget: Budget }>
  get(options?: QueryOptions<Transaction>): Promise<Pagination<Transaction>>
  getWithBudget(options?: QueryOptions<Transaction>): Promise<Pagination<Transaction & { budget: Budget }>>
  
  create(data: z.infer<typeof transactionFormSchema | typeof transferMoneyFormSchema>): Promise<Transaction>
  delete(id: string): Promise<Transaction>
  
  updateStatus(id: string, processed: boolean): Promise<Transaction>
  addRelated(id: string, data: z.infer<typeof relatedTransactionsFormSchema>): Promise<Transaction>
  transferMoney(data: z.infer<typeof transferMoneyFormSchema>): Promise<{ rootTransaction: Transaction; targetTransaction: Transaction }>
}

export interface IPaymentAPI {
  get(options?: QueryOptions<Payment>): Promise<Pagination<Payment>>
  addSubpayment(transactionId: string, data: z.infer<typeof paymentFormSchema>): Promise<Transaction>
  removeSubpayment(transactionId: string, subpaymentId: string): Promise<Transaction>
}

export interface IBackupAPI {
  create(complete: boolean, budgetIds: string[]): Promise<{ downloadUrl: string, fileContent: BackupFileContent }>
  restore(backupFile: z.infer<typeof backupSchema>): Promise<void>
}
