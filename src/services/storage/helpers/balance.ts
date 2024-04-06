// storage
import { BudgetStorageAPI, TransactionStorageAPI } from "@/services/storage/collections"

// types
import { Budget, Payment } from "@/services/api/types"
import { StorageCollection } from "../types"

// TODO: write documentation
function handlePayment(balance: Budget['balance'], payment: Payment, action: 'execute' | 'undo'): Budget['balance'] {
  const { current, income, loss } = balance

  const { type, processedAmount = 0, isSubpayment } = payment
  let { amount } = payment

  // Subpayments don't have a process state so
  // we need to use the base amount of a subpayment
  if (action === 'undo') {
    amount = isSubpayment ? amount : processedAmount
  }

  // Calculate balance deltas
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

// TODO: write documentation
async function updateBalance(budgetId: string, payment: Payment, action: 'execute' | 'undo'): Promise<Budget> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()

  const budget = await budgetStorage.findById(budgetId)

  return await budgetStorage.save({
    ...budget,
    balance: handlePayment(budget.balance, payment, action)
  })
}

// TODO: write documentation
async function revertPaymentsOnBalance(payments: Payment[]): Promise<void> {
  const budgetStorage = BudgetStorageAPI.getInstance().getStorage()
  const transactionStorage = TransactionStorageAPI.getInstance().getStorage()
  
  const budgetCollection = await budgetStorage.fetchFromStorage()
  const transactionCollection = await transactionStorage.fetchFromStorage()

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
