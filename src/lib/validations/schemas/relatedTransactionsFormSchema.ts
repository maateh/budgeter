import { transactionSchema } from "@/lib/validations"

const relatedTransactionsFormSchema = transactionSchema.pick({
  relatedIds: true
})

export { relatedTransactionsFormSchema }
