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
  get(): Promise<Budget[]>
  getBudgetsWithTransactions(
    transactionLimit: number,
    filterBy: Partial<Budget>,
    filterTransactionsBy: Partial<Transaction>,
    params: PaginationParams
  ): Promise<Pagination<Budget & { transactions: Transaction[] }>>
  getById(id: UUID): Promise<Budget>

  create(data: z.infer<typeof BudgetValidation>): Promise<Budget>
  update(id: UUID, data: z.infer<typeof BudgetValidation>): Promise<Budget>
  delete(id: UUID): Promise<Budget>
}

export interface IBudgetNoteAPI {
  getNoteWithBudget(budgetId: UUID, noteId: UUID): Promise<BudgetNote & { budget: Budget }>
  getByStatus(budgetId: UUID, status: BudgetNote['status']): Promise<BudgetNote[]>

  create(budgetId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  updateText(budgetId: UUID, noteId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  updateStatus(budgetId: UUID, noteId: UUID, status: BudgetNote['status']): Promise<BudgetNote>  
  delete(budgetId: UUID, noteId: UUID): Promise<BudgetNote>
}

export interface ITransactionAPI {
  getTransactionWithBudget(transactionId: UUID): Promise<Transaction & { budget: Budget }>
  getTransactionsWithBudgets(filterBy: Partial<Transaction>, params: PaginationParams): Promise<Pagination<Transaction & { budget: Budget }>>
  getByBudgets(filterBy: Partial<Transaction>): Promise<Record<UUID, Transaction[]>> // storage helper

  create(data: z.infer<typeof TransactionValidation>, executePayment: boolean): Promise<Transaction>
  updateStatus(id: UUID, processed: boolean): Promise<Transaction>
  delete(id: UUID, undoPayment: boolean): Promise<Transaction>
}
