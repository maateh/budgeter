import { z } from "zod"

const relatedTransactionsFormSchema = z.object({
  relatedId: z.string().uuid({ message: 'Related transaction ID is invalid!' })
})

export { relatedTransactionsFormSchema }
