import { z } from "zod"

// validations
import { transferMoneyFormSchema } from "@/lib/validations"

export type TransferMoneyFieldValues = z.infer<typeof transferMoneyFormSchema>
