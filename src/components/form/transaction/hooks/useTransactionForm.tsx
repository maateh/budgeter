import { useForm } from "react-hook-form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// models
import Transaction from "@/models/Transaction"

// validations
import {
  TransactionValidation,
  TransferringTransactionValidation,
  TemporaryTransactionValidation
} from "@/lib/validation"

const useTransactionForm = (type: Transaction['type'], budgetId?: string) => {
  let validationSchema

  switch (type) {
    case 'default':
      validationSchema = TransactionValidation;
      break;
    case 'transferring':
      validationSchema = TransferringTransactionValidation;
      break;
    case 'temporary':
      validationSchema = TemporaryTransactionValidation;
      break;
    default:
      throw new Error(`Unknown transaction type: ${type}`);
  }

  return useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      budgetId,
      label: '',
      payment: {
        type: '+',
        amount: 0
      },
      status: 'processed'
    }
  })
}

export default useTransactionForm
