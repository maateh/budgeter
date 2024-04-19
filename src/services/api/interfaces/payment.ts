import { z } from "zod"

// types
import { Pagination, Payment, QueryOptions, Transaction } from "@/services/api/types"

// validations
import { paymentFormSchema } from "@/lib/validations"

interface IPaymentAPI {
  get(options?: QueryOptions<Payment>): Promise<Pagination<Payment>>
  addSubpayment(transactionId: string, data: z.infer<typeof paymentFormSchema>): Promise<Transaction>
  removeSubpayment(transactionId: string, subpaymentId: string): Promise<Transaction>
}

export default IPaymentAPI
