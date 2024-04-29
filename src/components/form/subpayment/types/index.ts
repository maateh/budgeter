import { z } from "zod"

import { subpaymentFormSchema } from "@/lib/validations"

export type SubpaymentFieldValues = z.infer<typeof subpaymentFormSchema>

export type SubpaymentSubmitProps = {
  transactionId: string
}
