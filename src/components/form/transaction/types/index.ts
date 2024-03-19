import { z } from "zod"

// validations
import { transactionSchema } from "@/components/form/transaction/validations"

export type TransactionFieldValues = z.infer<typeof transactionSchema>

