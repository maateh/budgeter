import * as z from "zod"

import { budgetNoteSchema, budgetSchema, transactionSchema } from "@/lib/validation/schemas"

export const BudgetValidation = budgetSchema

export const BudgetNoteValidation = budgetNoteSchema

export const TransactionValidation = transactionSchema

export const TransferringTransactionValidation = transactionSchema.extend({
  targetBudgetId: z.string().uuid()
})

export const TemporaryTransactionValidation = transactionSchema.extend({
  expireDate: z.date()
})
