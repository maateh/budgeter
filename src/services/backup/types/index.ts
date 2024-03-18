import { UUID } from "crypto"
import { Budget, BudgetNote, Transaction } from "@/services/api/types"

export type BackupData = {
  budgets: Record<UUID, Budget>
  transactions: Record<UUID, Transaction>
  notes: Record<UUID, BudgetNote>
}

export type BackupFormat = {
  version: number
  backup_date: Date
  complete: boolean
  data: BackupData
}
