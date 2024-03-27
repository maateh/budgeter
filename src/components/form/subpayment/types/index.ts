import { z } from "zod"

import { paymentSchema } from "@/components/form/subpayment/validations"

export type SubpaymentFieldValues = z.infer<typeof paymentSchema>
