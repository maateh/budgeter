// storage
import { SubpaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// helpers
import { revertSubpaymentsOnBalance, updateBalance } from "@/services/storage/helpers/balance"

// types
import { FilterOptions, Subpayment, Transaction } from "@/services/api/types"
import { StorageCollection, TransactionDocument } from "@/services/storage/types"

/**
 * TODO: documentation
 */
function handlePaymentOnTransaction(
  transaction: Transaction,
  subpayment: Subpayment,
  action: 'execute' | 'undo'
): Transaction {
  const { payment: basePayment } = transaction
  const { amount, type } = subpayment

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
   * Need to swap the sign of the delta amount if
   * the transaction is a borrow transaction.
   */
  const borrowDelta = basePayment.type === '-'
    ? type === '+' ? amount : -amount
    : type === '+' ? -amount : amount

  if (action === 'execute') {
    basePayment.processedAmount += transaction.type === 'borrow'
      ? borrowDelta
      : amount
  }

  if (action === 'undo') {
    basePayment.processedAmount -= transaction.type === 'borrow'
      ? borrowDelta
      : amount
  }

  /**
   * Update base payment processed status. If 'processedAmount' has reached
   * the base payment amount, the status will be updated to processed.
   */
  const processed = basePayment.processedAmount >= basePayment.amount
  const date = new Date()

  return {
    ...transaction,
    updatedAt: date,
    payment: {
      ...basePayment,
      processed,
      processedAt: processed ? date : undefined,
    }
  }
}

/**
 * TODO: documentation
 */
async function updateTransaction(transactionId: string, subpayment: Subpayment, action: 'execute' | 'undo'): Promise<Transaction> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()

  const transaction = await transactionStorage.findById(transactionId)

  /** Update affected budget balance */
  await updateBalance(transaction, subpayment, { action })

  const updatedTransaction = handlePaymentOnTransaction(transaction, subpayment, action)
  return await transactionStorage.save(updatedTransaction)
}

/** FIXME:
 * Deletes transactions from storage based on the provided filter and
 * optionally reverts associated payments on the affected budgets.
 * 
 * @param filter - Filter options to select transactions to delete.
 * @param revertPayments - A boolean indicating whether to revert associated payments on budget balances before deletion. Default is true.
 * @returns A Promise resolving once the transactions are deleted and associated payments (if reverted) are removed.
 */
async function deleteTransactions(filter: FilterOptions<Transaction>, revertPayments: boolean = true): Promise<void> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const paymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

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

    await revertSubpaymentsOnBalance(payments)
  }

  /** Delete affected payments & transactions from the storage */
  await paymentStorage.bulkDelete({ filterBy: { transactionId: ids }})
  await transactionStorage.bulkDelete(filter)
}

/** FIXME:
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

export { handlePaymentOnTransaction, updateTransaction, deleteTransactions, manageRelatedTransactions }
