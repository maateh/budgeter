import { z } from "zod"

// types
import { BackupFileContent } from "@/services/backup/types"

// validations
import { backupSchema } from "@/lib/validations"

interface IBackupAPI {
  create(complete: boolean, budgetIds: string[]): Promise<{ downloadUrl: string, fileContent: BackupFileContent, fileName: string }>
  restore(backupFile: z.infer<typeof backupSchema>): Promise<void>
}

export default IBackupAPI
