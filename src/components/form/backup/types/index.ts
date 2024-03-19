import { z } from "zod"

// validations
import { backupFileSchema } from "@/components/form/backup/validations"

export type RestoreBackupFieldValues = z.infer<typeof backupFileSchema>
