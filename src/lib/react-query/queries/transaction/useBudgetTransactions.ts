import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { PaginationParams, Transaction } from "@/services/api/types"
import { UUID } from "crypto"

type TransactionsQueryOptions = {
  params?: PaginationParams
  filterBy?: Partial<Transaction>
}

const useBudgetTransactions = (budgetId: UUID, { params, filterBy }: TransactionsQueryOptions = {}) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgetTransactions', budgetId],
    queryFn: async () => await api.transaction.get(params, { ...filterBy, budgetId })
  })
}

export default useBudgetTransactions
