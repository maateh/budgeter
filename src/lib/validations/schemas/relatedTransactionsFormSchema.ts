import { transactionSchema } from "@/lib/validations"

const relatedTransactionsFormSchema = transactionSchema.pick({
  related: true
})

export { relatedTransactionsFormSchema }
