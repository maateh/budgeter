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
 * TODO: documentation
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

  /**
   * TODO: comment
   */
  const isBorrowment = transaction.type === 'borrow'
  const skipIncomeAndLossDeltas = transaction.type !== 'default' || skipCurrentDelta
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
 * TODO: documentation
 */
async function updateBalance(
  transaction: Transaction,
  subpayment: Subpayment,
  options: BalanceUpdaterOptions
): Promise<Budget> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const budget = await budgetStorage.findById(transaction.budgetId)
  
  if (subpayment.budgetId !== transaction.budgetId) {
    const targetBudget = await budgetStorage.findById(subpayment.budgetId)

    await budgetStorage.save({
      ...targetBudget,
      balance: handlePaymentOnBalance(targetBudget.balance, transaction, subpayment, options)
    })
  }

  return await budgetStorage.save({
    ...budget,
    balance: handlePaymentOnBalance(budget.balance, transaction, subpayment, {
      ...options,
      skipCurrentDelta: subpayment.budgetId !== transaction.budgetId
    })
  })
}

/**
 * Reverts subpayments on balances and saves the updated budgets.
 * 
 * @param subpayments - The array of subpayments to revert on balances.
 * @returns A Promise resolving once the subpayments have been reverted on balances.
 */
async function revertSubpaymentsOnBalance(subpayments: Subpayment[]): Promise<void> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  const subpaymentStorage = SubpaymentStorageAPI.getInstance().getStorage()
  
  const budgetCollection = await budgetStorage.fetchFromStorage()
  const transactionCollection = await transactionStorage.fetchFromStorage()

  /**
   * TODO: comment
   */
  const budgets: StorageCollection<Budget> = subpayments.reduce((budgets, subpayment) => {
    const budget = budgetCollection[subpayment.budgetId]
    const transaction = transactionCollection[subpayment.transactionId]

    budget.balance = handlePaymentOnBalance(budget.balance, transaction, subpayment, { action: 'undo' })

    return {
      ...budgets,
      [budget.id]: budget
    }
  }, {} as StorageCollection<Budget>)

  /**
   * TODO: comment
   */
  await subpaymentStorage.bulkDelete({
    filterBy: { id: subpayments.map((subpayment) => subpayment.id) }
  })

  await budgetStorage.bulkSave(budgets)
}

export { handlePaymentOnBalance, updateBalance, revertSubpaymentsOnBalance }
