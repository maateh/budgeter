import { z } from "zod"

const paymentFormSchema = z.object({
  type: z.union([
    z.literal('+'),
    z.literal('-')
  ]),
  amount: z.coerce.number()
    .gt(0, { message: 'Amount must be a positive number.' })
})

const paymentSchema = paymentFormSchema.extend({
  id: z.string().uuid({ message: 'Payment ID is invalid!' }),
  transactionId: z.string().uuid({ message: 'Transaction ID is invalid!' }),
  paidBackAmount: z.coerce.number().optional()
})

export { paymentSchema, paymentFormSchema }
