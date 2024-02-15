// models
import Transaction from "@/models/Transaction"

// types
import { FieldValues } from "@/components/form/transaction/types"

export function parseDateValues(values: FieldValues) {
  const currentDate = new Date()
  const date: Transaction['date'] = {
    created: currentDate,
    expected: currentDate,
    credited: currentDate
  }

  if (values.status === 'processing' && values.expectedDate) {
    date.credited = undefined
    date.expected = values.expectedDate
  }

  return date
}
