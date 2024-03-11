import { UUID } from "crypto"
import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

const useGetTransactionsWithBudgets = (
  type: Transaction['type'],
  processed: Transaction['processed'],
  budgetId?: UUID
) => {
  const { api } = useAPI()

  const filterBy: Partial<Transaction> = budgetId
    ? { type, processed, budgetId }
    : { type, processed }

  return useInfiniteQuery({
    queryKey: ['getTransactionsWithBudgets', type, processed, budgetId || 'all'],
    queryFn: async ({ pageParam: offset }) => {
      return await api.transaction.getTransactionsWithBudgets(filterBy, { offset, limit: 5 })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useGetTransactionsWithBudgets
