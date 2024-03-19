import { z } from "zod"

// validations
import { budgetSchema } from "@/components/form/budget/validations"

export type BudgetFieldValues = z.infer<typeof budgetSchema>

export type BudgetSubmitProps = {
  budgetId?: string
  type: 'create' | 'edit'
}
