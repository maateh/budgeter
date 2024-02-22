import { UUID } from "crypto"
import { z } from "zod"

// validations
import { BudgetNoteValidation, BudgetValidation } from "@/lib/validation"

export type FieldValues = {
  budget: z.infer<typeof BudgetValidation>
  note: z.infer<typeof BudgetNoteValidation>
}

export type BudgetSubmitProps = {
  budgetId?: UUID
}

export type BudgetNoteSubmitProps = {
  budgetId: UUID
  noteId?: UUID
}
