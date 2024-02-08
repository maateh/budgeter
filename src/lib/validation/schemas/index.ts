import * as z from "zod"

import { BudgetType } from "@/models/Budget"
import { TransactionType } from "@/models/Transaction"

export const budgetSchema = z.object({
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(50, { message: 'Too long.' }),
  type: z.nativeEnum(BudgetType),
  balance: z.object({
    current: z.coerce.number().default(0),
    ceiling: z.coerce.number()
  }),
  currency: z.string()
    .min(1, { message: 'Too short.' })
    .max(5, { message: 'Too long.' }),
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
  label: z.string()
    .min(2, { message: 'Too short.' })
    .max(28, { message: 'Too long.' }),
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().gt(0),
  status: z.string(),
  expectedDate: z.date().optional()
})
