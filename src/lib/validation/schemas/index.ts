import * as z from "zod"

import { BudgetType } from "@/models/Budget"

export const budgetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: 'Too short.' }).max(50, { message: 'Too long.' }),
  type: z.nativeEnum(BudgetType),
  balance: z.object({
    current: z.coerce.number()
      .gte(0)
      .lte(0)
      .default(0),
    ceiling: z.coerce.number()
  }),
  theme: z.object({
    background: z.string()
      .length(7, { message: 'Background value should be a valid HEX color. e.g. #f1f1f1' })
      .regex(/^#/),
    foreground: z.string()
    .length(7, { message: 'Foregound value should be a valid HEX color. e.g. #f1f1f1' })
    .regex(/^#/),
  })
})

export const transactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number(),
  date: z.date()
})
