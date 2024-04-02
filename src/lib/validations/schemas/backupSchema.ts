import { z } from "zod"

import { budgetDocumentSchema, noteDocumentSchema, paymentDocumentSchema, transactionDocumentSchema } from "@/lib/validations"

const backupDataSchema = z.object({
  budgets: z.record(z.string().uuid(), budgetDocumentSchema),
  transactions: z.record(z.string().uuid(), transactionDocumentSchema),
  payments: z.record(z.string().uuid(), paymentDocumentSchema),
  notes: z.record(z.string().uuid(), noteDocumentSchema)
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
