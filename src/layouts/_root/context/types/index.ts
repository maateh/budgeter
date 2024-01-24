// types
import { ModelData } from "@/storage/types"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

export enum StorageAction {
  SET_BUDGETS = 'SET_BUDGETS',
  SET_BUDGET = 'SET_BUDGET',
  DELETE_BUDGET = 'DELETE_BUDGET',
  SET_TRANSACTIONS = 'SET_TRANSACTIONS',
  SET_TRANSACTION = 'SET_TRANSACTION',
  DELETE_TRANSACTION = 'DELETE_TRANSACTION'
}

export type TStorageState = {
  budgets: ModelData['budget'],
  transactions: ModelData['transaction']
}

export type TStorageAction = {
  type: StorageAction,
  payload: {
    budgets?: TStorageState['budgets'],
    budget?: Budget,
    transactions?: TStorageState['transactions'],
    transaction?: Transaction,
    id?: string
  }
}

export type TStorageContext = TStorageState & {
  dispatch: React.Dispatch<TStorageAction>
}
