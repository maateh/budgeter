import * as z from "zod"

export const budgetNoteSchema = z.object({
  text: z.string()
    .min(3, { message: 'Too short.' })
})
