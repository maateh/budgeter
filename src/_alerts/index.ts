import { lazy } from "react"

// budgets
export const DeleteBudget = lazy(() => import('./budgets/delete'))

// budget-note
export const DeleteNote = lazy(() => import('./budgets/notes/delete'))

// transactions
export const DeleteTransaction = lazy(() => import('./transactions/delete'))

// backup
export const RestoreBackup = lazy(() => import('./backup/restore'))
