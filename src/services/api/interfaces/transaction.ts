import { z } from "zod"

// types
import { Budget, Pagination, QueryOptions, Transaction } from "@/services/api/types"

// validations
import { relatedTransactionsFormSchema, transactionFormSchema, transferMoneyFormSchema } from "@/lib/validations"

interface ITransactionAPI {
  getByIdWithBudget(id: string): Promise<Transaction & { budget: Budget }>
  get(options?: QueryOptions<Transaction>): Promise<Pagination<Transaction>>
  getWithBudget(options?: QueryOptions<Transaction>): Promise<Pagination<Transaction & { budget: Budget }>>
  
  create(data: z.infer<typeof transactionFormSchema | typeof transferMoneyFormSchema>): Promise<Transaction>
  delete(id: string, removeRelated?: boolean): Promise<Transaction>
  
  updateStatus(id: string, processed: boolean): Promise<Transaction>
  addRelated(id: string, data: z.infer<typeof relatedTransactionsFormSchema>): Promise<Transaction>
  removeRelated(id: string, relatedId: string): Promise<Transaction>
  transferMoney(data: z.infer<typeof transferMoneyFormSchema>): Promise<{ rootTransaction: Transaction; targetTransaction: Transaction }>
}

export default ITransactionAPI
