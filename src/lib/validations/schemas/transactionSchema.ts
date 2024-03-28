import { z } from "zod"

import { paymentSchema } from "@/lib/validations"

const transactionFormSchema = z.object({
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

const transactionSchema = transactionFormSchema.extend({
  id: z.string().uuid({ message: 'Transaction ID is invalid!' }),
  type: z.union([
    z.literal('default'),
    z.literal('borrow'),
    z.literal('transfer')
  ]),
  createdAt: z.coerce.date(),
  subpayments: z.array(paymentSchema).optional(),
  related: z.array(
    z.string().uuid({ message: 'One of related transacion ID is invalid!' })
  ).optional()
})

export { transactionSchema, transactionFormSchema }