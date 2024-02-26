import { z } from "zod"

// validations
import { TransactionValidation } from "@/lib/validation"

export type TransactionFieldValues = z.infer<typeof TransactionValidation>

