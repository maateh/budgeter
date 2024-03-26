import { z } from "zod"

import { transactionSchema } from "@/components/form/transaction/validations"

export const transferMoneySchema = transactionSchema.extend({
  type: z.literal('transfer'),
  targetBudgetId: z.string().uuid({ message: 'Budget ID is invalid.' })
})
