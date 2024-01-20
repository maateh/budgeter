// types
import { StorageAction, TStorageAction } from "../types"
import { StorageData } from "@/storage"

// models
import Budget from "@/models/Budget"

export const setBudgets = (dispatch: React.Dispatch<TStorageAction>, budgets: StorageData['budget']) => {
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
