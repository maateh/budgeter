// storage
import { BudgetStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// types
import { Balance, Budget, Payment } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

type BalanceUpdaterOptions = {
  action: 'execute' | 'undo'
  isBorrowment?: boolean
  skipCurrentDelta?: boolean
  skipIncomeAndLossDeltas?: boolean
  skipBorrowmentDelta?: boolean
  borrowmentTargetBudgetId?: string
}

/**
 * Handles payment by updating the budget balance based on the given payment and action.
 * 
 * @param balance - The current balance of the budget.
 * @param payment - The payment object to handle.
 * @param options - Options that can affect the update calculations of the balance.
 * @returns The updated balance after handling the payment action.
 */
function handlePayment(balance: Balance, payment: Payment, options: BalanceUpdaterOptions): Balance {
  const {
    action,
    isBorrowment = false,
    skipCurrentDelta = false,
    skipIncomeAndLossDeltas = false,
    skipBorrowmentDelta = false
  } = options
  
  const { current, income, loss, borrowment } = balance
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
 * @param budgetId - The ID of the budget to update the balance for.
 * @param payment - The payment object used to update the balance.
 * @param options - Options that can affect the update calculations of the balance.
 * @returns A Promise resolving to the updated budget after updating the balance.
 */
async function updateBalance(budgetId: string, payment: Payment, options: BalanceUpdaterOptions): Promise<Budget> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const budget = await budgetStorage.findById(budgetId)
  
  if (options.isBorrowment && options.borrowmentTargetBudgetId) {
    const targetBudget = await budgetStorage.findById(options.borrowmentTargetBudgetId)
    await budgetStorage.save({
      ...targetBudget,
      balance: handlePayment(targetBudget.balance, payment, {
        ...options,
        skipIncomeAndLossDeltas: true,
        skipBorrowmentDelta: true
      })
    })
  }

  return await budgetStorage.save({
    ...budget,
    balance: handlePayment(budget.balance, payment, {
      ...options,
      skipCurrentDelta: options.isBorrowment && !!options.borrowmentTargetBudgetId
    })
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
