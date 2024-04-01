import { z } from "zod"

import { budgetSchema, noteSchema, paymentSchema, transactionDocumentSchema } from "@/lib/validations"

const backupDataSchema = z.object({
  budgets: z.record(z.string().uuid(), budgetSchema),
  transactions: z.record(z.string().uuid(), transactionDocumentSchema),
  payments: z.record(z.string().uuid(), paymentSchema),
  notes: z.record(z.string().uuid(), noteSchema)
})

const backupSchema = z.object({
  fileContent: z.object({
    version: z.coerce.number(),
    backup_date: z.coerce.date(),
    complete: z.boolean(),
    data: backupDataSchema
  })
})

export { backupSchema, backupDataSchema }
