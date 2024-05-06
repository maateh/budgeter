// storage
import { SubpaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// helpers
import { revertSubpaymentsOnBalance, updateBalance } from "@/services/storage/helpers/balance"

// types
import { FilterOptions, Subpayment, Transaction } from "@/services/api/types"
import { StorageCollection, TransactionDocument } from "@/services/storage/types"

/**
 * Updates a transaction's payment based on the provided subpayment and action.
 * 
 * @param {Transaction} transaction - The transaction to update.
 * @param {Subpayment} subpayment - The subpayment applied to the transaction.
 * @param {'execute' | 'undo'} action - The action to perform ('execute' to apply the subpayment, 'undo' to revert it).
 * @returns {Transaction} The updated transaction with the modified payment.
 * 
 * This function updates the base payment of the given transaction based on the provided subpayment and action.
 * If the action is 'execute', it applies the subpayment to the transaction. If the action is 'undo',
 * it reverts the effect of the subpayment. The function returns the updated transaction.
 */
function handlePaymentOnTransaction(
  transaction: Transaction,
  subpayment: Subpayment,
  action: 'execute' | 'undo'
): Transaction {
  const { payment: basePayment } = transaction
  const { amount, type } = subpayment

  /**
   * Adjust 'processedAmount' and 'processed' state
   * based on the action and payment type.
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

  /** Check if the transaction's base payment is fully processed. */
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
 * Updates a transaction based on the provided subpayment and action.
 * 
 * This function updates the transaction's processed amount, processed state, and processed at date based on the subpayment and action.
 * Additionally, it updates the affected budget balance.
 * 
 * @param {string} transactionId - The ID of the transaction to update.
 * @param {Subpayment} subpayment - The subpayment applied to the transaction.
 * @param {'execute' | 'undo'} action - The action to perform on the transaction ('execute' or 'undo').
 * @returns {Promise<Transaction>} The updated transaction.
 */
async function updateTransaction(transactionId: string, subpayment: Subpayment, action: 'execute' | 'undo'): Promise<Transaction> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()

  const transaction = await transactionStorage.findById(transactionId)

  /** Update affected budget balance */
  await updateBalance(transaction, subpayment, { action })

  /**
   * Update transaction's processed amount, processed state,
   * and processed at date based on the subpayment and action.
   */
  const updatedTransaction = handlePaymentOnTransaction(transaction, subpayment, action)
  return await transactionStorage.save(updatedTransaction)
}

/**
 * Deletes transactions from storage based on the provided filter and
 * optionally reverts associated payments on the affected budgets.
 * 
 * @param {FilterOptions<Transaction>} filter - Filter options to select transactions to delete.
 * @param {boolean} revertPayments - A boolean indicating whether to revert associated payments on budget balances before deletion. Default is true.
 * @returns A Promise resolving once the transactions are deleted and associated payments (if reverted) are removed.
 */
async function deleteTransactions(filter: FilterOptions<Transaction>, revertPayments: boolean = true): Promise<void> {
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()

  const transactions = await transactionStorage.find(filter)
  const ids = transactions.map((tr) => tr.id)
  
  /** Remove affected transaction ids from other transactions relatedIds */
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

  /** Revert subpayments on the affected budgets */
  if (revertPayments) {
    const subpayments = await subpaymentStorage.find({
      filterBy: { transactionId: ids }
    })
    
    await revertSubpaymentsOnBalance(subpayments)
  }

  /** Delete affected transactions from the storage */
  await transactionStorage.bulkDelete(filter)
}

/**
 * Manages related transaction IDs for a given transaction by adding or removing related IDs.
 * 
 * @param {string} id - The ID of the transaction to manage related IDs for.
 * @param {string[]} relatedIds - An array of related transaction IDs to add or remove.
 * @param {'add' | 'remove'} action - The action to perform: 'add' to add related IDs or 'remove' to remove them.
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
