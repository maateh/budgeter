import { z } from "zod"

import { transactionSchema } from "@/components/form/transaction/validations"

export const transferMoneySchema = transactionSchema.extend({
  targetBudgetId: z.string().uuid({ message: 'Budget ID is invalid.' })
})
