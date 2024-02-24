import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

const useLoadBudgetTransactionsQuery = (budgetId: UUID, status?: Transaction['status']) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budget', budgetId, 'transactions', status],
    queryFn: async () => await api.transaction.getByBudget(budgetId, status)
  })
}

export default useLoadBudgetTransactionsQuery
