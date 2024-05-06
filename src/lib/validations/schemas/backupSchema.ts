import { z } from "zod"

import { budgetDocumentSchema, noteDocumentSchema, transactionDocumentSchema, subpaymentDocumentSchema } from "@/lib/validations"

const backupDataSchema = z.object({
  budgets: z.record(z.string().uuid(), budgetDocumentSchema),
  transactions: z.record(z.string().uuid(), transactionDocumentSchema),
  subpayments: z.record(z.string().uuid(), subpaymentDocumentSchema),
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
