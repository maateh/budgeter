import { z } from "zod"

// validations
import { BudgetNoteValidation, BudgetValidation } from "@/lib/validation"

export type FieldValues = {
  budget: z.infer<typeof BudgetValidation>
  note: z.infer<typeof BudgetNoteValidation>
}
