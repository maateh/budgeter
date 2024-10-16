import { z } from "zod"

// types
import { Pagination, Subpayment, QueryOptions, Transaction } from "@/services/api/types"

// validations
import { subpaymentFormSchema } from "@/lib/validations"

interface ISubpaymentAPI {
  get(options?: QueryOptions<Subpayment>): Promise<Pagination<Subpayment>>
  addSubpayment(transactionId: string, data: z.infer<typeof subpaymentFormSchema>): Promise<Subpayment & { transaction: Transaction }>
  removeSubpayment(transactionId: string, subpaymentId: string): Promise<Subpayment & { transaction: Transaction }>
}

export default ISubpaymentAPI
