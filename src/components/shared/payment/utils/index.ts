// types
import { Payment, Transaction } from "@/services/api/types"

function isNeutral(type: Transaction['type'], processed: boolean): boolean {
  return ((type === 'default' && !processed) || (type === 'borrow' && processed))
}

function getPaymentAmount(payment: Payment, processed: boolean): number {
  const { processedAmount = 0, amount } = payment
  const difference = amount - processedAmount
  
  return processed ? amount
    : difference > 0 ? difference : amount
}

export { isNeutral, getPaymentAmount }
