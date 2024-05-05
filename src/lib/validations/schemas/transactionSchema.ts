import { z } from "zod"

import { basePaymentSchema, basePaymentFormSchema } from "@/lib/validations"

const transactionFormSchema = z.object({
  budgetId: z.string().uuid({ message: 'Budget ID is invalid.' }),
  type: z.union([
    z.literal('default'),
    z.literal('borrow')
  ]),
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(28, { message: 'Too long.' }),
  payment: basePaymentFormSchema,
  relatedIds: z.array(
    z.string().uuid({ message: 'One of related Transaction IDs is invalid!' })
  ).optional()
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
  payment: basePaymentSchema,
  relatedIds: z.array(
    z.string().uuid({ message: 'One of related Transaction IDs is invalid!' })
  )
})

const transactionDocumentSchema = transactionSchema

export { transactionSchema, transactionFormSchema, transactionDocumentSchema }
