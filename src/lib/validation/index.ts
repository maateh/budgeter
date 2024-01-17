import * as z from "zod"

import { budgetSchema, transactionSchema } from "@/lib/validation/schemas"

export const BudgetValidation = budgetSchema

export const TransactionValidation = transactionSchema.and(
  z.object({
    budgetId: z.string().uuid()
  })
)

export const TransactionsValidation = z.object({
  budgetId: z.string().uuid(),
  transactions: z.array(transactionSchema)
})
