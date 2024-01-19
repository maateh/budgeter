// types
import { StorageAction, TStorageAction } from "../types"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

export const setBudgets = (dispatch: React.Dispatch<TStorageAction>, budgets: Budget[]) => {
  dispatch({
    type: StorageAction.SET_BUDGETS,
    payload: { budgets }
  })
}

export const addBudget = (dispatch: React.Dispatch<TStorageAction>, budget: Budget) => {
  dispatch({
    type: StorageAction.ADD_BUDGET,
    payload: { budget }
  })
}

export const deleteBudget = (dispatch: React.Dispatch<TStorageAction>, id: string) => {
  dispatch({
    type: StorageAction.DELETE_BUDGET,
    payload: { id }
  })
}

export const addTransaction = (dispatch: React.Dispatch<TStorageAction>, budget: Budget, transaction: Transaction) => {
  dispatch({
    type: StorageAction.ADD_TRANSACTION,
    payload: { budget, transaction }
  })
}
