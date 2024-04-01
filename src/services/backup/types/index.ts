import { Budget, BudgetNote, Payment } from "@/services/api/types"
import { TransactionDocument } from "@/services/storage/types"

export type BackupData = {
  budgets: Record<string, Budget>
  notes: Record<string, BudgetNote>
  transactions: Record<string, TransactionDocument>
  payments: Record<string, Payment>
}

export type BackupInfo = {
  version: number
  backup_date: Date
  complete: boolean
}

export type BackupFileContent = BackupInfo & {
  data: BackupData
}
