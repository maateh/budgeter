import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"
import { UUID } from "crypto"

const useGetTransactionsWithBudgets = (
  type: Transaction['type'],
  processed: Transaction['processed'],
  budgetId?: UUID
) => {
  const { api } = useAPI()

  const filterBy: Partial<Transaction> = budgetId
    ? { type, processed, budgetId }
    : { type, processed }

  return useQuery({
    queryKey: ['getTransactionsWithBudgets', type, processed, budgetId || 'all'],
    queryFn: async () => await api.transaction.getTransactionsWithBudgets(filterBy)
  })
}

export default useGetTransactionsWithBudgets
