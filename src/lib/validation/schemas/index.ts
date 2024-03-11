import * as z from "zod"

export const budgetSchema = z.object({
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(50, { message: 'Too long.' }),
  type: z.string()
    .regex(/^(income|expense)$/),
  balance: z.object({
    currency: z.string()
      .min(1, { message: 'Too short.' })
      .max(5, { message: 'Too long.' }),
    current: z.coerce.number(),
    ceiling: z.coerce.number()
  }),
  theme: z.string()
    .length(7, { message: 'Theme color should be a valid HEX color. e.g. #f1f1f1' })
    .regex(/^#/)
})

export const budgetNoteSchema = z.object({
  text: z.string()
    .min(3, { message: 'Too short.' })
})

export const transactionSchema = z.object({
  budgetId: z.string().uuid(),
  type: z.string()
    .regex(/^(default|borrow)$/),
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(28, { message: 'Too long.' }),
  payment: z.object({
    type: z.string()
      .min(1)
      .max(1)
      .regex(/^(?:\+|-)$/),
    amount: z.coerce.number().gt(0)
  }),
  processed: z.boolean(),
  processedAt: z.date().optional()
})
