import { z } from "zod"

import { transactionFormSchema } from "@/lib/validations"

const transferMoneyFormSchema = transactionFormSchema.extend({
  type: z.literal('transfer'),
  targetBudgetId: z.string().uuid({ message: 'Target budget ID is invalid.' }),
  customExchangeRate: z.coerce.number().gte(0).optional()
})

export { transferMoneyFormSchema }
