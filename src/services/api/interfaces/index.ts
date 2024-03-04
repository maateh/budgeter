import { UUID } from "crypto"
import { z } from "zod"

// types
import { Budget, BudgetNote, Currencies, Transaction } from "@/services/api/types"

// validations
import { BudgetNoteValidation, BudgetValidation, TransactionValidation } from "@/lib/validation"

export interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export interface IBudgetAPI {
  get(): Promise<Budget[]>
  getById(id: UUID): Promise<Budget>
  create(data: z.infer<typeof BudgetValidation>): Promise<Budget>
  update(id: UUID, data: z.infer<typeof BudgetValidation>): Promise<Budget>
  delete(id: UUID): Promise<Budget>
}

export interface IBudgetNoteAPI {
  getByStatus(budgetId: UUID, status: BudgetNote['status']): Promise<BudgetNote[]>
  create(budgetId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  updateText(budgetId: UUID, noteId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote>
  updateStatus(budgetId: UUID, noteId: UUID, status: BudgetNote['status']): Promise<BudgetNote>  
  delete(budgetId: UUID, noteId: UUID): Promise<BudgetNote>
}

export interface ITransactionAPI {
  getTransactionsWithBudgets(filterBy: Partial<Transaction>): Promise<(Transaction & { budget: Budget })[]>
  // getByBudgets(type: Transaction['type']): Promise<Transaction[]>
  // getByBudget(budgetId: UUID, type?: Transaction['type']): Promise<Transaction[]>

  create(data: z.infer<typeof TransactionValidation>, executePayment: boolean): Promise<Transaction>
  updateStatus(id: UUID, processed: boolean): Promise<Transaction>
  delete(id: UUID, undoPayment: boolean): Promise<Transaction>
}
