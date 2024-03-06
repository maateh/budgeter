import { UUID } from "crypto"
import { z } from "zod"

// validations
import { BudgetValidation } from "@/lib/validation"

export type BudgetFieldValues = z.infer<typeof BudgetValidation>

export type BudgetSubmitProps = {
  budgetId?: UUID
  type: 'create' | 'edit'
}
