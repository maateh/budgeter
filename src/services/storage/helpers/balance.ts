// storage
import { BudgetStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// types
import { Balance, Budget, Payment } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

type BalanceUpdaterOptions = {
  action: 'execute' | 'undo'
  isBorrowment?: boolean
}

/**
 * Handles payment by updating the budget balance based on the given payment and action.
 * 
 * @param balance - The current balance of the budget.
 * @param payment - The payment object to handle.
 * @param action - The action to perform: 'execute' to apply the payment or 'undo' to revert it.
 * @returns The updated balance after handling the payment action.
 */
function handlePayment(balance: Balance, payment: Payment, options: BalanceUpdaterOptions): Balance {
  const { current, income, loss, borrowment } = balance
  const { action, isBorrowment = false } = options

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
  const incomeDelta = !isBorrowment && type === '+' ? amount * update : 0
  const lossDelta = !isBorrowment && type === '-' ? amount * update : 0
  const borrowmentDelta = isBorrowment ? currentDelta : 0

  return {
    ...balance,
    current: current + currentDelta,
    income: income + incomeDelta,
    loss: loss + lossDelta,
    borrowment: borrowment + borrowmentDelta
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
async function updateBalance(budgetId: string, payment: Payment, options: BalanceUpdaterOptions): Promise<Budget> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const budget = await budgetStorage.findById(budgetId)

  return await budgetStorage.save({
    ...budget,
    balance: handlePayment(budget.balance, payment, options)
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

    budget.balance = handlePayment(budget.balance, payment, { action: 'undo' })

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
