// storage
import { PaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// helpers
import { updateBalance } from "@/services/storage/helpers/balance"

// types
import { Payment, Transaction } from "@/services/api/types"

// TODO: write documentation
function handlePayment(transaction: Transaction, executionPayment: Payment, action: 'execute' | 'undo'): Transaction {
  // Destructure & initalize fields from transaction's base payment
  const { payment } = transaction
  payment.processedAmount = payment.processedAmount || 0

  // Destructure & initalize fields from "executionPayment"
  const { amount, processedAmount = 0, type, isSubpayment } = executionPayment

  // do not touch a running system
  if (action === 'execute') {
    payment.processedAmount += transaction.type === 'borrow' && isSubpayment
      ? payment.type === '-'
        ? type === '+' ? amount : -amount
        : type === '+' ? -amount : amount
      : amount
  }

  if (action === 'undo') {
    payment.processedAmount -= transaction.type === 'borrow' && isSubpayment
      ? payment.type === '-'
        ? type === '+' ? amount : -amount
        : type === '+' ? -amount : amount
      : processedAmount
  }

  // Update transaction processed state
  const processed = payment.processedAmount >= payment.amount
  const date = new Date()

  return {
    ...transaction,
    payment,
    processed,
    processedAt: processed ? date : undefined,
    updatedAt: date
  }
}

// TODO: write documentation
async function updatePayment(transactionId: string, executionPayment: Payment, action: 'execute' | 'undo'): Promise<Transaction> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

  const { paymentId, budgetId, type, ...document } = await transactionStorage.findById(transactionId)
  const payment = await paymentStorage.findById(paymentId)

  // Update affected budget's balance
  await updateBalance(budgetId, {
    ...executionPayment,
    processedAmount: type === 'borrow' && action === 'undo' && !payment.isSubpayment
      ? payment.amount - (executionPayment.processedAmount || 0)
      : executionPayment.processedAmount
  }, action)

  // Update transaction and its payment based on 'executionPayment'
  const { payment: updatedPayment, ...transaction } = handlePayment({
    ...document, budgetId, type, payment 
  }, executionPayment, action)

  // Need to store/remove subpayments that affects base payment's process
  if (executionPayment.isSubpayment) {
    if (action === 'execute') await paymentStorage.save(executionPayment)
    if (action === 'undo') await paymentStorage.deleteById(executionPayment.id)
  }

  // Save updated transaction and payments to storage
  await transactionStorage.save({ ...transaction, paymentId: payment.id })
  await paymentStorage.save(updatedPayment)

  return { ...transaction, payment: updatedPayment }
}

async function manageRelated(): Promise<void> {
  // TODO: implement
}

export { updatePayment, manageRelated }
