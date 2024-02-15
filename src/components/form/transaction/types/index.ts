import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

// validations
import { TransactionValidation, TransferringTransactionValidation, TemporaryTransactionValidation } from "@/lib/validation"


export type FieldValue = {
  default: z.infer<typeof TransactionValidation>
  transferring: z.infer<typeof TransferringTransactionValidation>
  temporary: z.infer<typeof TemporaryTransactionValidation>
}

export type FieldValues = 
  FieldValue['default'] |
  FieldValue['transferring'] |
  FieldValue['temporary']

export type TransactionFormReturn = 
  UseFormReturn<FieldValue['default']> |
  UseFormReturn<FieldValue['transferring']> |
  UseFormReturn<FieldValue['temporary']>
