// types
import { FieldValues } from "@/components/form/transaction/types"

export const defaultValues: FieldValues = {
  budgetId: '',
  label: '',
  payment: {
    type: '+',
    amount: 0
  },
  status: 'processed'
}
