import { BackupData } from "@/services/backup/types"

export interface IBackupHelper {
  dataCollector(budgetIds?: string[]): Promise<BackupData>
  generateFile(data: BackupData): File
}
