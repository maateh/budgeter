// storage
import { BudgetStorageAPI, SubpaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// helpers
import { handlePaymentOnBalance } from "@/services/storage/helpers/balance"
import { handlePaymentOnTransaction } from "@/services/storage/helpers/transaction"

// types
import { Budget, Subpayment, Transaction } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

/**
 * Reverts subpayments and updates budgets and transactions accordingly.
 * 
 * @param {Subpayment[]} subpayments - The subpayments to revert.
 * @returns {Promise<void>} A promise that resolves once the subpayments are reverted.
 * 
 * This function reverts the specified subpayments and updates the balances of affected budgets and transactions accordingly.
 * It adjusts the balance of each affected budget and transaction by undoing the effect of the subpayment.
 * Finally, it removes the reverted subpayments from the storage.
 */
async function revertSubpayments(subpayments: Subpayment[]): Promise<void> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()
  
  const budgetCollection = await budgetStorage.fetchFromStorage()
  const transactionCollection = await transactionStorage.fetchFromStorage()

  /**
   * Prepare updated budgets and transactions by
   * reverting the subpayments.
   */
  const { budgets, transactions } = subpayments.reduce(({ budgets, transactions }, subpayment) => {
    const budget = budgetCollection[subpayment.budgetId]
    let transaction = transactionCollection[subpayment.transactionId]

    budget.balance = handlePaymentOnBalance(budget.balance, transaction, subpayment, { action: 'undo' })
    transaction = handlePaymentOnTransaction(transaction, subpayment, 'undo')

    return {
      budgets: {
        ...budgets,
        [budget.id]: budget
      },
      transactions: {
        ...transactions,
        [transaction.id]: transaction
      }
    }
  }, {} as { budgets: StorageCollection<Budget>, transactions: StorageCollection<Transaction> })

  /** Remove the reverted subpayments from the storage. */
  await subpaymentStorage.bulkDelete({
    filterBy: { id: subpayments.map((subpayment) => subpayment.id) }
  })

  /** Update budgets and transactions with the reverted balances. */
  await budgetStorage.bulkSave(budgets)
  await transactionStorage.bulkSave(transactions)
}

export { revertSubpayments }
