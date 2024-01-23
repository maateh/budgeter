// types
import { StorageAction, TStorageAction } from "../types"
import { ModelData } from "@/storage/types"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

export const setBudgets = (dispatch: React.Dispatch<TStorageAction>, budgets: ModelData['budget']) => {
  dispatch({
    type: StorageAction.SET_BUDGETS,
    payload: { budgets }
  })
}

export const setBudget = (dispatch: React.Dispatch<TStorageAction>, budget: Budget) => {
  dispatch({
    type: StorageAction.SET_BUDGET,
    payload: { budget }
  })
}

export const deleteBudget = (dispatch: React.Dispatch<TStorageAction>, id: string) => {
  dispatch({
    type: StorageAction.DELETE_BUDGET,
    payload: { id }
  })
}

export const setTransactions = (dispatch: React.Dispatch<TStorageAction>, transactions: ModelData['transaction']) => {
  dispatch({
    type: StorageAction.SET_TRANSACTIONS,
    payload: { transactions }
  })
}

export const setTransaction = (dispatch: React.Dispatch<TStorageAction>, transaction: Transaction) => {
  dispatch({
    type: StorageAction.SET_TRANSACTION,
    payload: { transaction }
  })
}

export const deleteTransaction = (dispatch: React.Dispatch<TStorageAction>, id: string) => {
  dispatch({
    type: StorageAction.DELETE_TRANSACTION,
    payload: { id }
  })
}
