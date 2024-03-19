import * as z from "zod"

export const balanceSchema = z.object({
  currency: z.string()
    .min(1, { message: 'Too short.' })
    .max(5, { message: 'Too long.' }),
  current: z.coerce.number(),
  ceiling: z.coerce.number()
})

export const budgetSchema = z.object({
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(50, { message: 'Too long.' }),
  type: z.union([
    z.literal('income'),
    z.literal('expense')
  ]),
  balance: balanceSchema,
  theme: z.string()
    .length(7, { message: 'Theme color should be a valid HEX color. e.g. #f1f1f1' })
    .regex(/^#/, { message: 'Theme color should be a valid HEX color. e.g. #f1f1f1' })
})
