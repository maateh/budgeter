import { UUID } from "crypto"
import { z } from "zod"

// validations
import { BudgetNoteValidation } from "@/lib/validation"

export type BudgetNoteFieldValues = z.infer<typeof BudgetNoteValidation>

export type BudgetNoteSubmitProps = {
  budgetId: UUID
  noteId?: UUID
}
