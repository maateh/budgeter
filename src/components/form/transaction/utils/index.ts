// models
import Transaction from "@/models/Transaction"

// types
import { FormFields } from "@/components/form/transaction/types"

export function parseDateValues(values: FormFields['default' | 'transferring' | 'temporary']) {
  const currentDate = new Date()
  const date: Transaction['date'] = {
    created: currentDate,
    expected: currentDate,
    credited: currentDate
  }

  if (values.status === 'processing') {
    date.credited = undefined
    date.expected = values.expectedDate!
  }

  return date
}
