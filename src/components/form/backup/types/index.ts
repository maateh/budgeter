import { z } from "zod"

// validations
import { backupSchema } from "@/lib/validations"

export type RestoreBackupFieldValues = z.infer<typeof backupSchema>
