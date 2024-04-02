import { BudgetDocument, BudgetNoteDocument, PaymentDocument, TransactionDocument } from "@/services/storage/types"

export type BackupData = {
  budgets: Record<string, BudgetDocument>
  notes: Record<string, BudgetNoteDocument>
  transactions: Record<string, TransactionDocument>
  payments: Record<string, PaymentDocument>
}

export type BackupInfo = {
  version: number
  backup_date: Date
  complete: boolean
}

export type BackupFileContent = BackupInfo & {
  data: BackupData
}
