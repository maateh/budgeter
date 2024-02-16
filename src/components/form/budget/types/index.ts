import { z } from "zod"

// models
import Budget, { BudgetNote } from "@/models/Budget"

// validations
import { BudgetNoteValidation, BudgetValidation } from "@/lib/validation"

export type FieldValues = {
  budget: z.infer<typeof BudgetValidation>
  note: z.infer<typeof BudgetNoteValidation>
}

export type BudgetSubmitProps = {
  type: 'create' | 'edit'
  budget?: Budget
}

export type BudgetNoteSubmitProps = {
  budget: Budget
  note?: BudgetNote
}
