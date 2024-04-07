// storage
import { BudgetStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// types
import { Budget, Payment } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

/**
 * Handles payment by updating the budget balance based on the given payment and action.
 * 
 * @param balance - The current balance of the budget.
 * @param payment - The payment object to handle.
 * @param action - The action to perform: 'execute' to apply the payment or 'undo' to revert it.
 * @returns The updated balance after handling the payment action.
 */
function handlePayment(balance: Budget['balance'], payment: Payment, action: 'execute' | 'undo'): Budget['balance'] {
  const { current, income, loss } = balance

  const { type, processedAmount = 0, isSubpayment } = payment
  let { amount } = payment

  /**
   * NOTE: Subpayments don't have a process state so
   * we need to use the base amount of a subpayment
   */
  if (action === 'undo') {
    amount = isSubpayment ? amount : processedAmount
  }

  /**
   * Calculate balance deltas based on the given action
   * 
   * NOTE: 'update' is the multiplier to swap the sign of
   * the amount based on the payment type
   */
  const update: 1 | -1 = action === 'execute' ? 1 : -1
  
  const currentDelta = type === '+' ? amount * update : -amount * update
  const incomeDelta = type === '+' ? amount * update : isSubpayment ? -amount * update : 0
  const lossDelta = type === '-' ? amount * update : isSubpayment ? -amount * update : 0

  // FIXME: There is still a problem with income & loss deltas
  // when creating an already paid back borrow transaction.
  // -> The starter base payment isn't calculated because it isn't a subpayment.

  // FIXME: There is another problem with income & loss deltas
  // when deleting transactions those can have subpayments.
  // -> The income & loss isn't calculated because it is reverting
  //    only based on the base payment's processedAmount field.

  return {
    ...balance,
    current: current + currentDelta,
    income: income + incomeDelta,
    loss: loss + lossDelta
  }
}

/**
 * Updates the balance of a budget based on the provided payment and action.
 * 
 * @param budgetId - The ID of the budget to update the balance for.
 * @param payment - The payment object used to update the balance.
 * @param action - The action to perform: 'execute' to apply the payment or 'undo' to revert it.
 * @returns A Promise resolving to the updated budget after updating the balance.
 */
async function updateBalance(budgetId: string, payment: Payment, action: 'execute' | 'undo'): Promise<Budget> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const budget = await budgetStorage.findById(budgetId)

  return await budgetStorage.save({
    ...budget,
    balance: handlePayment(budget.balance, payment, action)
  })
}

/**
 * Reverts payments on balances and saves the updated budgets.
 * 
 * @param payments - The array of payments to revert on balances.
 * @returns A Promise resolving once the payments have been reverted on balances.
 */
async function revertPaymentsOnBalance(payments: Payment[]): Promise<void> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  
  const budgetCollection = await budgetStorage.fetchFromStorage()
  const transactionCollection = await transactionStorage.fetchFromStorage()

  /**
   * Performing payments on balances and save the updated budgets.
   * 
   * NOTE: Need to calculate 'processedAmount' of the payment
   * manually if transaction type is borrow and the payment
   * isn't a subpayment because the correct withdrawal amount will be the
   * difference of the base payment amount minus the current
   * progress of the execution payment.
   */
  const budgets: Budget[] = payments.reduce((budgets, payment) => {
    const budget = budgetCollection[payment.budgetId]
    const transaction = transactionCollection[payment.transactionId]

    if (transaction.type === 'borrow' && !payment.isSubpayment) {
      payment.processedAmount = payment.amount - (payment.processedAmount || 0)
    }

    budget.balance = handlePayment(budget.balance, payment, 'undo')

    return [...budgets, budget]
  }, [] as Budget[])

  await budgetStorage.bulkSave(
    budgets.reduce((docs, budget) => ({
      ...docs,
      [budget.id]: budget
    }), {} as StorageCollection<Budget>)
  )
}

export { updateBalance, revertPaymentsOnBalance }
