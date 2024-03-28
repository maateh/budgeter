import { z } from "zod"

const balanceFormSchema = z.object({
  currency: z.string()
    .min(1, { message: 'Too short.' })
    .max(5, { message: 'Too long.' }),
  current: z.coerce.number(),
  ceiling: z.coerce.number()
})

const balanceSchema = balanceFormSchema.extend({
  income: z.coerce.number().gte(0),
  loss: z.coerce.number().gte(0)
})

export { balanceSchema, balanceFormSchema }
