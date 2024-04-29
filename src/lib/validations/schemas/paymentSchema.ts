import { z } from "zod"

const paymentFormSchema = z.object({
  type: z.union([
    z.literal('+'),
    z.literal('-')
  ]),
  amount: z.coerce.number()
    .gt(0, { message: 'Amount must be a positive number.' })
})

const subpaymentFormSchema = paymentFormSchema.extend({
  budgetId: z.string().uuid({ message: 'Budget ID is invalid!' })
})

const paymentSchema = paymentFormSchema.extend({
  id: z.string().uuid({ message: 'Payment ID is invalid!' }),
  budgetId: z.string().uuid({ message: 'Budget ID is invalid!' }),
  transactionId: z.string().uuid({ message: 'Transaction ID is invalid!' }),
  createdAt: z.coerce.date(),
  processedAmount: z.coerce.number().optional(),
  isSubpayment: z.coerce.boolean()
})

const paymentDocumentSchema = paymentSchema

export { paymentSchema, subpaymentFormSchema, paymentDocumentSchema, paymentFormSchema }
