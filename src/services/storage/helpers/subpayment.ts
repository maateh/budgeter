// storage
import { BudgetStorageAPI, SubpaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// helpers
import { handlePaymentOnBalance } from "@/services/storage/helpers/balance"
import { handlePaymentOnTransaction } from "@/services/storage/helpers/transaction"

// types
import { Budget, Subpayment, Transaction } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

/**
 * TODO: documentation
 */
async function revertSubpayments(subpayments: Subpayment[]): Promise<void> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()
  
  const budgetCollection = await budgetStorage.fetchFromStorage()
  const transactionCollection = await transactionStorage.fetchFromStorage()

  /**
   * TODO: comment
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

  /**
   * TODO: comment
   */
  await subpaymentStorage.bulkDelete({
    filterBy: { id: subpayments.map((subpayment) => subpayment.id) }
  })

  await budgetStorage.bulkSave(budgets)
  await transactionStorage.bulkSave(transactions)
}

export { revertSubpayments }
