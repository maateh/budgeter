import { z } from "zod"

// types
import { Budget, BudgetNote, Pagination, QueryOptions } from "@/services/api/types"

// validations
import { noteFormSchema } from "@/lib/validations"

interface IBudgetNoteAPI {
  getByIdWithBudget(budgetId: string, noteId: string): Promise<BudgetNote & { budget: Budget }>
  get(options?: QueryOptions<BudgetNote>): Promise<Pagination<BudgetNote>>

  create(budgetId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote>
  updateText(budgetId: string, noteId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote>
  updateStatus(budgetId: string, noteId: string, status: BudgetNote['status']): Promise<BudgetNote>
  delete(budgetId: string, noteId: string): Promise<BudgetNote>
}

export default IBudgetNoteAPI
