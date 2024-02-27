import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

const useGetTransactionsWithBudgets = (type: Transaction['type'], budgetId?: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['getTransactionsWithBudgets', type, budgetId || 'all'],
    queryFn: async () => await api.transaction.getTransactionsWithBudgets(type, budgetId)
  })
}

export default useGetTransactionsWithBudgets
