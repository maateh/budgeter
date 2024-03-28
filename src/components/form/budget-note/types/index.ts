import { z } from "zod"

// validations
import { noteFormSchema } from "@/lib/validations"

export type BudgetNoteFieldValues = z.infer<typeof noteFormSchema>

export type BudgetNoteSubmitProps = {
  budgetId: string
  noteId?: string
  onSubmitted: () => void
}
