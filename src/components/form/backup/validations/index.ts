import { z } from "zod"

// validations
import { balanceSchema, budgetSchema } from "@/components/form/budget/validations"
import { budgetNoteSchema } from "@/components/form/budget-note/validations"
import { transactionSchema } from "@/components/form/transaction/validations"

export const backupDataSchema = z.object({
  budgets: z.record(z.string().uuid(),
    budgetSchema.extend({
      id: z.string().uuid({ message: 'ID is invalid.' }),
      balance: balanceSchema.extend({
        income: z.coerce.number()
          .gte(0, { message: 'Income must be a positive number.' }),
        loss: z.coerce.number()
          .gte(0, { message: 'Loss must be a positive number.' })
      })
    })
  ),
  transactions: z.record(z.string().uuid(),
    transactionSchema.extend({
      id: z.string().uuid({ message: 'ID is invalid.' }),
      createdAt: z.coerce.date()
    })
  ),
  notes: z.record(z.string().uuid(),
    budgetNoteSchema.extend({
      id: z.string().uuid({ message: 'ID is invalid.' }),
      budgetId: z.string().uuid({ message: 'ID is invalid.' }),
      status: z.union([
        z.literal('open'),
        z.literal('closed')
      ]),
      createdAt: z.coerce.date(),
      editedAt: z.coerce.date().optional(),
      closedAt: z.coerce.date().optional()
    })
  )
})

export const backupFileSchema = z.object({
  fileContent: z.object({
    version: z.coerce.number(),
    backup_date: z.coerce.date(),
    complete: z.boolean(),
    data: backupDataSchema
  })
})
