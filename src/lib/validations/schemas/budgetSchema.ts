import { z } from "zod"

import { balanceSchema, balanceDocumentSchema, balanceFormSchema } from "@/lib/validations"

const budgetFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'Too short.' })
    .max(50, { message: 'Too long.' }),
  balance: balanceFormSchema,
  theme: z.string()
    .length(7, { message: 'Theme color should be a valid HEX color. e.g. #f1f1f1' })
    .regex(/^#/, { message: 'Theme color should be a valid HEX color. e.g. #f1f1f1' })
})

const budgetSchema = budgetFormSchema.extend({
  id: z.string().uuid({ message: 'Budget ID is invalid!' }),
  balance: balanceSchema
})

const budgetDocumentSchema = budgetSchema.extend({
  balance: balanceDocumentSchema
})

export { budgetSchema, budgetDocumentSchema, budgetFormSchema }
