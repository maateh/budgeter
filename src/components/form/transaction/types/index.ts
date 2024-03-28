import { z } from "zod"

// validations
import { transactionFormSchema } from "@/lib/validations"

export type TransactionFieldValues = z.infer<typeof transactionFormSchema>

