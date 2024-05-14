import { z } from "zod"

// types
import { Balance, Budget, Pagination, QueryOptions } from "@/services/api/types"

// validations
import { budgetFormSchema } from "@/lib/validations"

interface IBudgetAPI {
  getById(id: string): Promise<Budget>
  get(options?: QueryOptions<Budget>): Promise<Pagination<Budget>>
  getSummarizedBalance(currency: string): Promise<Balance>

  create(data: z.infer<typeof budgetFormSchema>): Promise<Budget>
  update(id: string, data: z.infer<typeof budgetFormSchema>): Promise<Budget>
  delete(id: string): Promise<Budget>
}

export default IBudgetAPI
