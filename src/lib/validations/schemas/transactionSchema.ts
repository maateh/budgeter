import { z } from "zod"

import { paymentSchema, paymentFormSchema } from "@/lib/validations"

const transactionFormSchema = z.object({
  budgetId: z.string().uuid({ message: 'Budget ID is invalid.' }),
  type: z.union([
    z.literal('default'),
    z.literal('borrow')
  ]),
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(28, { message: 'Too long.' }),
  payment: paymentFormSchema,
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
  updatedAt: z.coerce.date(),
  payment: paymentSchema,
  related: z.array(
    z.string().uuid({ message: 'One of related transacion ID is invalid!' })
  )
})

const transactionDocumentSchema = transactionSchema.omit({
  payment: true
}).extend({
  paymentId: z.string().uuid({ message: 'Payment ID is invalid!' }),
})

export { transactionSchema, transactionFormSchema, transactionDocumentSchema }
