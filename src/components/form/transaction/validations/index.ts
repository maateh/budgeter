import * as z from "zod"

import { paymentSchema } from "@/components/form/subpayment/validations"

export const transactionSchema = z.object({
  budgetId: z.string().uuid({ message: 'Budget ID is invalid.' }),
  type: z.union([
    z.literal('default'),
    z.literal('borrow')
  ]),
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(28, { message: 'Too long.' }),
  payment: paymentSchema,
  processed: z.boolean(),
  processedAt: z.coerce.date().optional()
})
