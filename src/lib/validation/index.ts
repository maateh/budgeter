import * as z from "zod"

import { BudgetType } from "@/models/Budget"

export const BudgetValidation = z.object({
  name: z.string().min(2, { message: 'Too short.' }).max(50, { message: 'Too long.' }),
  type: z.nativeEnum(BudgetType),
  balance: z.object({
    current: z.coerce.number(),
    starting: z.coerce.number(),
    max: z.coerce.number()
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
