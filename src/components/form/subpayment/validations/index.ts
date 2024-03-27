import { z } from "zod"

export const paymentSchema = z.object({
  type: z.union([
    z.literal('+'),
    z.literal('-')
  ]),
  amount: z.coerce.number()
    .gt(0, { message: 'Amount must be a positive number.' })
})
