// storage
import { PaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// helpers
import { revertPaymentsOnBalance, updateBalance } from "@/services/storage/helpers/balance"

// types
import { FilterOptions, Payment, Transaction } from "@/services/api/types"
import { StorageCollection, TransactionDocument } from "@/services/storage/types"

/**
 * Handles the execution or undoing of a payment within a transaction, updating the transaction accordingly.
 * 
 * @param transaction - The transaction object to handle the payment for.
 * @param executionPayment - The payment object representing the executional payment.
 * @param action - The action to perform: 'execute' to apply the payment or 'undo' to revert it.
 * @returns The updated transaction after handling the payment action.
 */
function handlePayment(transaction: Transaction, executionPayment: Payment, action: 'execute' | 'undo'): Transaction {
  /** Destructure & initalize of the necessary fields from payments */
  const { amount, processedAmount = 0, type, isSubpayment } = executionPayment

  const { payment } = transaction
  payment.processedAmount = payment.processedAmount || 0

  /**
   * Handle different actions on the base payment
   * 
   * NOTE: 'processedAmount' value depends on:
   * - Transaction type is borrow && execution payment is a subpayment
   *   - Delta amount will be calculated by the type of the payments
   * 
   * - By default the delta amount will be:
   *   - action === 'execute' -> amount of the executional payment
   *   - action === 'undo' -> current progress of the executional payment
   * 
   * note: do not touch a running system
   */

  /**
   * Need to swap the sign of the delta amount based on
   * the type of the base and executional payments.
   */
  const borrowDelta = payment.type === '-'
    ? type === '+' ? amount : -amount
    : type === '+' ? -amount : amount

  if (action === 'execute') {
    payment.processedAmount += transaction.type === 'borrow' && isSubpayment
      ? borrowDelta
      : amount
  }

  if (action === 'undo') {
    payment.processedAmount -= transaction.type === 'borrow' && isSubpayment
      ? borrowDelta
      : processedAmount
  }

  /**
   * Update processed state of the transaction based on 'processedAmount'
   * whether it has reached the base payment amount or not.
   */
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

/**
 * Updates a transaction and its associated payment based on the provided execution payment and action.
 * 
 * @param transactionId - The ID of the transaction to update.
 * @param executionPayment - The payment object representing the executional payment.
 * @param action - The action to perform: 'execute' to apply the payment or 'undo' to revert it.
 * @returns A Promise resolving to the updated transaction after updating it and its payment.
 */
async function updateTransaction(transactionId: string, executionPayment: Payment, action: 'execute' | 'undo'): Promise<Transaction> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

  const { paymentId, budgetId, type, ...document } = await transactionStorage.findById(transactionId)
  const payment = await paymentStorage.findById(paymentId)

  /**
   * Update affected budget's balance
   * 
   * NOTE: Need to update the 'processedAmount' field manually when:
   * - transaction type is borrow
   * - action is undo
   * because the withdrawal amount will be the difference of the base payment
   * amount minus the current progress of the execution payment.
   */
  await updateBalance(budgetId, {
    ...executionPayment,
    processedAmount: type === 'borrow' && action === 'undo'
      ? payment.amount - (executionPayment.processedAmount || 0)
      : executionPayment.processedAmount
  }, { action, ignoreTrackingDeltas: type === 'borrow' })

  /**
   * Update transaction and its payment based on 'executionPayment'
   */
  const transaction: Transaction = { ...document, budgetId, type, payment }
  const { payment: updatedPayment, ...updatedTransaction } = handlePayment(
    transaction, executionPayment, action
  )

  /**
   * Need to store/remove subpayments that
   * affects process of the base payment
   */
  if (executionPayment.isSubpayment) {
    if (action === 'execute') await paymentStorage.save(executionPayment)
    if (action === 'undo') await paymentStorage.deleteById(executionPayment.id)
  }

  /**
   * Save updated transaction and its payment to storage
   */
  await transactionStorage.save({ ...updatedTransaction, paymentId: updatedPayment.id })
  await paymentStorage.save(updatedPayment)

  return { ...updatedTransaction, payment: updatedPayment }
}

/**
 * Deletes transactions from storage based on the provided filter and
 * optionally reverts associated payments on the affected budgets.
 * 
 * @param filter - Filter options to select transactions to delete.
 * @param revertPayments - A boolean indicating whether to revert associated payments on budget balances before deletion. Default is true.
 * @returns A Promise resolving once the transactions are deleted and associated payments (if reverted) are removed.
 */
async function deleteTransactions(filter: FilterOptions<Transaction>, revertPayments: boolean = true): Promise<void> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const paymentStorage = PaymentStorageAPI.getInstance().getStorage()

  const transactions = await transactionStorage.find(filter)
  const ids = transactions.map((tr) => tr.id)
  
  /** Remove affected transaction ids from relatedIds */
  const relatedTransactions = await transactionStorage.find({
    filterBy: { id: transactions.flatMap((tr) => tr.relatedIds) }
  })

  await transactionStorage.bulkSave(
    relatedTransactions.reduce((docs, tr) => ({
      ...docs,
      [tr.id]: {
        ...tr,
        relatedIds: tr.relatedIds.filter((id) => !ids.includes(id))
      }
    }), {} as StorageCollection<TransactionDocument>)
  )

  /** Revert affected payments on budget balance */
  if (revertPayments) {
    const payments = await paymentStorage.find({
      filterBy: { transactionId: ids, isSubpayment: false }
    })

    await revertPaymentsOnBalance(payments)
  }

  /** Delete affected payments & transactions from the storage */
  await paymentStorage.bulkDelete({ filterBy: { transactionId: ids }})
  await transactionStorage.bulkDelete(filter)
}

/**
 * Manages related transaction IDs for a given transaction by adding or removing related IDs.
 * 
 * @param id - The ID of the transaction to manage related IDs for.
 * @param relatedIds - An array of related transaction IDs to add or remove.
 * @param action - The action to perform: 'add' to add related IDs or 'remove' to remove them.
 * @returns A Promise resolving to the updated transaction document after managing related IDs.
 */
async function manageRelatedTransactions(id: string, relatedIds: string[], action: 'add' | 'remove'): Promise<TransactionDocument> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()

  /** Filter out potential duplicates */
  relatedIds = [...new Set(relatedIds)]

  /** Callback for filtering based on the given action */
  const filterOperation = (doc: TransactionDocument, ids: string[]): string[] => {
    return action === 'add'
      ? [...doc.relatedIds, ...ids]
      : doc.relatedIds.filter((id) => !ids.includes(id))
  }

  /**
   * Get and save related transactions to add the
   * current transaction ID as related.
   */
  const relatedTransactions = await transactionStorage.find({
    filterBy: { id: relatedIds }
  })

  await transactionStorage.bulkSave(
    relatedTransactions.reduce((docs, tr) => ({
      ...docs,
      [tr.id]: {
        ...tr,
        relatedIds: filterOperation(tr, [id])
      }
    }), {} as Record<string, TransactionDocument>)
  )

  /** Update transaction with the updated related ids */
  const document = await transactionStorage.findById(id)
  return await transactionStorage.save({
    ...document,
    relatedIds: filterOperation(document, relatedIds)
  })
}

export { updateTransaction, deleteTransactions, manageRelatedTransactions }
