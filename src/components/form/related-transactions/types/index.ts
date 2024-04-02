import { z } from "zod"

import { relatedTransactionsFormSchema } from "@/lib/validations"

export type RelatedTransactionsFieldValues = z.infer<typeof relatedTransactionsFormSchema>

export type RelatedTransactionsSubmitProps = {
  transactionId: string
}
