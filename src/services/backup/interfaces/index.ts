import { UUID } from "crypto"
import { BackupData } from "@/services/backup/types"

export interface IBackupHelper {
  dataCollector(budgetIds?: UUID[]): Promise<BackupData>
  generateFile(data: BackupData): File
}
