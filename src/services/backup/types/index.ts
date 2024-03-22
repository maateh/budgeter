import { Budget, BudgetNote, Transaction } from "@/services/api/types"

export type BackupData = {
  budgets: Record<string, Budget>
  transactions: Record<string, Transaction>
  notes: Record<string, BudgetNote>
}

export type BackupInfo = {
  version: number
  backup_date: Date
  complete: boolean
}

export type BackupFileContent = BackupInfo & {
  data: BackupData
}
