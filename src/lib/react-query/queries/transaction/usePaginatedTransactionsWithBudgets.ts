import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { PaginationParams, Transaction } from "@/services/api/types"

type PaginatedTransactionsWithBudgetsQueryOptions = {
  params?: PaginationParams
  filterBy?: Partial<Transaction>
}

const usePaginatedTransactionsWithBudgets = (
  type: Transaction['type'],
  processed: Transaction['processed'],
  { params, filterBy }: PaginatedTransactionsWithBudgetsQueryOptions = {}) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['paginatedTransactionsWithBudgets', type, processed],
    queryFn: async ({ pageParam: offset }) => {
      return await api.transaction.getPaginatedWithBudgets({
        limit: params?.limit || 5,
        offset
      }, { type, processed, ...filterBy })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default usePaginatedTransactionsWithBudgets
