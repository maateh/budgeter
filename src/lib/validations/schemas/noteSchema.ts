import { z } from "zod"

const noteFormSchema = z.object({
  text: z.string().min(3, { message: 'Too short.' })
})

const noteSchema = noteFormSchema.extend({
  id: z.string().uuid({ message: 'Note ID is invalid!' }),
  budgetId: z.string().uuid({ message: 'Budget ID is invalid!' }),
  status: z.union([
    z.literal('open'),
    z.literal('closed')
  ]),
  createdAt: z.coerce.date(),
  editedAt: z.coerce.date().optional(),
  closedAt: z.coerce.date().optional()
})

export { noteSchema, noteFormSchema }
