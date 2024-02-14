import { z } from "zod"

// validations
import { TransactionValidation, TransferringTransactionValidation, TemporaryTransactionValidation } from "@/lib/validation"

export type FormFields = {
  default: z.infer<typeof TransactionValidation>
  transferring: z.infer<typeof TransferringTransactionValidation>
  temporary: z.infer<typeof TemporaryTransactionValidation>
}
