// storage
import { BudgetStorageAPI, SubpaymentStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// types
import { Budget, Subpayment, Transaction } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

type BalanceUpdaterOptions = {
  action: 'execute' | 'undo'
  skipCurrentDelta?: boolean
}

/**
 * Updates the balance based on the provided subpayment and transaction details.
 * 
 * @param {Budget} budget - The current budget.
 * @param {Transaction} transaction - The transaction associated with the payment.
 * @param {Subpayment} subpayment - The subpayment to apply to the balance.
 * @param {BalanceUpdaterOptions} options - Additional options to control the balance update.
 * @param {'execute' | 'undo'} options.action - The action to perform on the balance ('execute' or 'undo').
 * @param {boolean} [options.skipCurrentDelta=false] - Whether to skip the current delta calculation.
 * @returns {Budget} The updated budget.
 */
function handlePaymentOnBalance(
  budget: Budget,
  transaction: Transaction,
  subpayment: Subpayment,
  options: BalanceUpdaterOptions
): Budget {
  const { action, skipCurrentDelta = false } = options
  
  const {
    id: budgetId,
    balance: { current, income, loss, borrowment }
  } = budget

  const { payment: basePayment } = transaction
  const { type, amount, isBorrowmentRoot } = subpayment

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
  const isBorrowment = transaction.type === 'borrow'
  const skipBorrowmentDelta = isBorrowment && subpayment.budgetId === budgetId

  /**
   * Calculate balance deltas based on the given action
   * 
   * NOTE: 'updater' is the multiplier to swap the sign of
   * the amount based on the payment type
   */
  const updater: 1 | -1 = action === 'execute' ? 1 : -1
  const delta = amount * updater
  
  const currentDelta = !skipCurrentDelta ? type === '+' ? delta : -delta : 0
  const incomeDelta = !isBorrowment && !skipIncomeAndLossDeltas && type === '+' ? delta : 0
  const lossDelta = !isBorrowment && !skipIncomeAndLossDeltas && type === '-' ? delta : 0

  const borrowmentUpdater = isBorrowmentRoot ? 1 : type === '+'
    ? basePayment.type === '+' ? 1 : -1
    : basePayment.type === '-' ? 1 : -1
  const borrowmentDelta = delta * borrowmentUpdater

  const borrowmentPlusDelta = !skipBorrowmentDelta && basePayment.type === '+' ? borrowmentDelta : 0
  const borrowmentMinusDelta = !skipBorrowmentDelta && basePayment.type === '-' ? borrowmentDelta : 0

  budget.balance = {
    ...budget.balance,
    current: current + currentDelta,
    income: income + incomeDelta,
    loss: loss + lossDelta,
    borrowment: {
      plus: borrowment.plus + borrowmentPlusDelta,
      minus: borrowment.minus + borrowmentMinusDelta
    }
  }

  return budget
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

    const updatedTargetBudget = handlePaymentOnBalance(targetBudget, transaction, subpayment, options)
    await budgetStorage.save(updatedTargetBudget)
  }

  /**
   * Update the balance of the budget associated with the transaction.
   * 
   * If the subpayment is associated with a different budget,
   * skip the current delta calculation.
   */
  const updatedBudget = handlePaymentOnBalance(budget, transaction, subpayment, {
    ...options,
    skipCurrentDelta: subpayment.budgetId !== transaction.budgetId
  })
  return await budgetStorage.save(updatedBudget)
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

    return {
      ...budgets,
      [budget.id]: handlePaymentOnBalance(budget, transaction, subpayment, { action: 'undo' })
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
