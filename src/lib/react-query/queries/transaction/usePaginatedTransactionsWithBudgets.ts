import { UUID } from "crypto"
import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

type PaginatedTransactionsWithBudgetsQueryOptions = {
  type: Transaction['type']
  processed: Transaction['processed']
  budgetId?: UUID
}

const usePaginatedTransactionsWithBudgets = ({ type, processed, budgetId }: PaginatedTransactionsWithBudgetsQueryOptions) => {
  const { api } = useAPI()

  const filterBy: Partial<Transaction> = budgetId
    ? { type, processed, budgetId }
    : { type, processed }

  return useInfiniteQuery({
    queryKey: ['paginatedTransactionsWithBudgets', type, processed],
    queryFn: async ({ pageParam: offset }) => {
      return await api.transaction.getPaginatedWithBudgets({ offset, limit: 5 }, filterBy)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default usePaginatedTransactionsWithBudgets
