import { z } from "zod"

import { paymentFormSchema } from "@/lib/validations"

export type SubpaymentFieldValues = z.infer<typeof paymentFormSchema>

export type SubpaymentSubmitProps = {
  transactionId: string
}
