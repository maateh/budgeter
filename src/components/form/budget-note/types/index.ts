import { z } from "zod"

// validations
import { budgetNoteSchema } from "@/components/form/budget-note/validations"

export type BudgetNoteFieldValues = z.infer<typeof budgetNoteSchema>

export type BudgetNoteSubmitProps = {
  budgetId: string
  noteId?: string
}
