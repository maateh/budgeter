import { UUID } from "crypto"
import { z } from "zod"

// validations
import { BudgetNoteValidation, BudgetValidation } from "@/lib/validation"

export type BudgetFieldValues = z.infer<typeof BudgetValidation>

export type BudgetNoteFieldValues = z.infer<typeof BudgetNoteValidation>

export type BudgetSubmitProps = {
  budgetId?: UUID
}

export type BudgetNoteSubmitProps = {
  budgetId: UUID
  noteId?: UUID
}
