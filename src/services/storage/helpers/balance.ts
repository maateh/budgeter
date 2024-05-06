// storage
import { BudgetStorageAPI, SubpaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// types
import { Balance, Budget, Subpayment, Transaction } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

type BalanceUpdaterOptions = {
  action: 'execute' | 'undo'
  skipCurrentDelta?: boolean
}

/**
 * Updates the balance based on the provided subpayment and transaction details.
 * 
 * @param {Balance} balance - The current balance.
 * @param {Transaction} transaction - The transaction associated with the payment.
 * @param {Subpayment} subpayment - The subpayment to apply to the balance.
 * @param {BalanceUpdaterOptions} options - Additional options to control the balance update.
 * @param {'execute' | 'undo'} options.action - The action to perform on the balance ('execute' or 'undo').
 * @param {boolean} [options.skipCurrentDelta=false] - Whether to skip the current delta calculation.
 * @returns {Balance} The updated balance.
 */
function handlePaymentOnBalance(
  balance: Balance,
  transaction: Transaction,
  subpayment: Subpayment,
  options: BalanceUpdaterOptions
): Balance {
  const { action, skipCurrentDelta = false } = options
  
  const { current, income, loss, borrowment } = balance
  const { type, amount } = subpayment

  /** Determines if the transaction is a borrowment. */
  const isBorrowment = transaction.type === 'borrow'

  /**
   * Skips income and loss delta calculation if:
   * - Transaction type is not 'default' or
   * - 'skipCurrentDelta' is set to true.
   */
  const skipIncomeAndLossDeltas = transaction.type !== 'default' || skipCurrentDelta

  /**
   * Skips borrowment delta calculation if:
   * - Transaction is a borrowment and
   * - Subpayment's budgetId is different from the transaction's budgetId.
   */
  const skipBorrowmentDelta = isBorrowment && subpayment.budgetId !== transaction.budgetId


  /**
   * Calculate balance deltas based on the given action
   * 
   * NOTE: 'update' is the multiplier to swap the sign of
   * the amount based on the payment type
   */
  const update: 1 | -1 = action === 'execute' ? 1 : -1
  
  const currentDelta = type === '+' ? amount * update : -amount * update
  const incomeDelta = !isBorrowment && !skipIncomeAndLossDeltas && type === '+' ? amount * update : 0
  const lossDelta = !isBorrowment && !skipIncomeAndLossDeltas && type === '-' ? amount * update : 0
  const borrowmentDelta = isBorrowment && !skipBorrowmentDelta ? currentDelta : 0

  return {
    ...balance,
    current: current + (!skipCurrentDelta ? currentDelta : 0),
    income: income + incomeDelta,
    loss: loss + lossDelta,
    borrowment: borrowment + borrowmentDelta
  }
}

/**
 * Updates the balance of a budget based on the provided payment and action.
 * 
 * @param {Transaction} transaction - The transaction associated with the payment.
 * @param {Subpayment} subpayment - The subpayment to apply to the balance.
 * @param {BalanceUpdaterOptions} options - Additional options to control the balance update.
 * @param {'execute' | 'undo'} options.action - The action to perform on the balance ('execute' or 'undo').
 * @param {boolean} [options.skipCurrentDelta=false] - Whether to skip the current delta calculation.
 * @returns {Promise<Budget>} The updated budget.
 */
async function updateBalance(
  transaction: Transaction,
  subpayment: Subpayment,
  options: BalanceUpdaterOptions
): Promise<Budget> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const budget = await budgetStorage.findById(transaction.budgetId)
  
  /**
   * If the subpayment belongs to a different budget than the transaction,
   * adjust the balance of both budgets accordingly.
   */
  if (subpayment.budgetId !== transaction.budgetId) {
    const targetBudget = await budgetStorage.findById(subpayment.budgetId)

    await budgetStorage.save({
      ...targetBudget,
      balance: handlePaymentOnBalance(targetBudget.balance, transaction, subpayment, options)
    })
  }

  /**
   * Update the balance of the budget associated with the transaction.
   * 
   * If the subpayment is associated with a different budget,
   * skip the current delta calculation.
   */
  return await budgetStorage.save({
    ...budget,
    balance: handlePaymentOnBalance(budget.balance, transaction, subpayment, {
      ...options,
      skipCurrentDelta: subpayment.budgetId !== transaction.budgetId
    })
  })
}

/**
 * Reverts subpayments from budgets and updates budget balances accordingly.
 * 
 * @param {Subpayment[]} subpayments - The subpayments to revert.
 * @returns {Promise<void>} A promise that resolves once the subpayments are reverted.
 * 
 * This function reverts the specified subpayments from budgets and updates the budget balances accordingly.
 * It adjusts the balance of each affected budget by undoing the effect of the subpayment.
 * Finally, it removes the reverted subpayments from the storage.
 */
async function revertSubpaymentsOnBalance(subpayments: Subpayment[]): Promise<void> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()
  
  const budgetCollection = await budgetStorage.fetchFromStorage()
  const transactionCollection = await transactionStorage.fetchFromStorage()

  /** Prepare updated budgets by reverting the subpayments. */
  const budgets: StorageCollection<Budget> = subpayments.reduce((budgets, subpayment) => {
    const budget = budgetCollection[subpayment.budgetId]
    const transaction = transactionCollection[subpayment.transactionId]

    budget.balance = handlePaymentOnBalance(budget.balance, transaction, subpayment, { action: 'undo' })

    return {
      ...budgets,
      [budget.id]: budget
    }
  }, {} as StorageCollection<Budget>)

  /** Remove the reverted subpayments from the storage. */
  await subpaymentStorage.bulkDelete({
    filterBy: { id: subpayments.map((subpayment) => subpayment.id) }
  })

  /** Update budgets with the reverted balances. */
  await budgetStorage.bulkSave(budgets)
}

export { handlePaymentOnBalance, updateBalance, revertSubpaymentsOnBalance }
