import { lazy } from "react"

// budget
export const SaveBudget = lazy(() => import('./budgets/create-edit'))
export const TransferMoney = lazy(() => import('./budgets/transfer'))

// transaction
export const TransactionDetails = lazy(() => import('./transactions/details'))
export const CreateTransaction = lazy(() => import('./transactions/create'))
