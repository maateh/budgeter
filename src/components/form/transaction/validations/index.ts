import * as z from "zod"

export const transactionSchema = z.object({
  budgetId: z.string().uuid({ message: 'Budget ID is invalid.' }),
  type: z.union([
    z.literal('default'),
    z.literal('borrow')
  ]),
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(28, { message: 'Too long.' }),
  payment: z.object({
    type: z.union([
      z.literal('+'),
      z.literal('-')
    ]),
    amount: z.coerce.number()
      .gt(0, { message: 'Amount must be a positive number.' })
  }),
  processed: z.boolean(),
  processedAt: z.date().optional()
})
