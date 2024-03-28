import { z } from "zod"

// validations
import { budgetFormSchema } from "@/lib/validations"

export type BudgetFieldValues = z.infer<typeof budgetFormSchema>

export type BudgetSubmitProps = {
  budgetId?: string
  type: 'create' | 'edit'
}
