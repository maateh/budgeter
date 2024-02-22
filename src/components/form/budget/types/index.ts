import { UUID } from "crypto"
import { z } from "zod"

// validations
import { BudgetNoteValidation, BudgetValidation } from "@/lib/validation"

export type FieldValues = {
  budget: z.infer<typeof BudgetValidation>
  note: z.infer<typeof BudgetNoteValidation>
}

export type BudgetSubmitProps = {
  // type: 'create' | 'edit'
  // budget?: Budget
  budgetId?: UUID
}

export type BudgetNoteSubmitProps = {
  // budget: Budget
  // note?: BudgetNote
  budgetId: UUID
  noteId?: UUID
}
