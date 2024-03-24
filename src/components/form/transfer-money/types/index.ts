import { z } from "zod"

// validations
import { transferMoneySchema } from "@/components/form/transfer-money/validations"

export type TransferMoneyFieldValues = z.infer<typeof transferMoneySchema>
