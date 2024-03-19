import { UUID } from "crypto"
import { z } from "zod"

// validations
import { budgetSchema } from "@/components/form/budget/validations"

export type BudgetFieldValues = z.infer<typeof budgetSchema>

export type BudgetSubmitProps = {
  budgetId?: UUID
  type: 'create' | 'edit'
}
