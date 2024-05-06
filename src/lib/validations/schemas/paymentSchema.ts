import { z } from "zod"

const paymentFormSchema = z.object({
  type: z.union([
    z.literal('+'),
    z.literal('-')
  ]),
  amount: z.coerce.number()
    .gt(0, { message: 'Amount must be a positive number.' })
})

// base payment
const basePaymentFormSchema = paymentFormSchema.extend({
  processed: z.coerce.boolean(),
  processedAt: z.coerce.date().optional(),
})

const basePaymentSchema = basePaymentFormSchema.extend({
  processedAmount: z.coerce.number(),
  createdAt: z.coerce.date()
})

const basePaymentDocumentSchema = basePaymentSchema

// subpayment
const subpaymentFormSchema = paymentFormSchema.extend({
  budgetId: z.string().uuid({ message: 'Budget ID is invalid!' })
})

const subpaymentSchema = subpaymentFormSchema.extend({
  id: z.string().uuid({ message: 'Payment ID is invalid!' }),
  transactionId: z.string().uuid({ message: 'Transaction ID is invalid!' }),
  createdAt: z.coerce.date(),
  isBorrowmentRoot: z.coerce.boolean().optional()
})

const subpaymentDocumentSchema = subpaymentSchema

export {
  basePaymentSchema, basePaymentFormSchema, basePaymentDocumentSchema,
  subpaymentSchema, subpaymentFormSchema, subpaymentDocumentSchema
}
