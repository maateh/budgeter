// types
import { Transaction } from "@/services/api/types"

function isNeutral(type: Transaction['type'], processed: boolean): boolean {
  return ((type === 'default' && !processed) || (type === 'borrow' && processed))
}

function getPaymentAmount({ amount, processedAmount = 0, processed }: {
  amount: number
  processedAmount?: number
  processed: boolean
}): number {
  const difference = amount - processedAmount
  
  return processed ? amount
    : difference > 0 ? difference : amount
}

export { isNeutral, getPaymentAmount }
