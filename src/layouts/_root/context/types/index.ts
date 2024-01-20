// types
import { StorageData } from "@/storage"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

export enum StorageAction {
  SET_BUDGETS = 'SET_BUDGETS',
  SET_BUDGET = 'SET_BUDGET',
  DELETE_BUDGET = 'DELETE_BUDGET'
}

export type TStorageState = {
  budgets: StorageData['budget']
}

export type TStorageAction = {
  type: StorageAction,
  payload: {
    budgets?: TStorageState['budgets'],
    budget?: Budget,
    id?: string,
    transaction?: Transaction
  }
}

export type TStorageContext = TStorageState & {
  dispatch: React.Dispatch<TStorageAction>
}
