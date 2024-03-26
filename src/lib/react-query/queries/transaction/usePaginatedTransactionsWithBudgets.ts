import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { PaginationParams, Transaction } from "@/services/api/types"

type PaginatedTransactionsWithBudgetsQueryOptions = {
  params?: PaginationParams
  filterBy?: Partial<Transaction>
}

const usePaginatedTransactionsWithBudgets = ({ params, filterBy }: PaginatedTransactionsWithBudgetsQueryOptions = {}) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['paginatedTransactionsWithBudgets', filterBy],
    queryFn: async ({ pageParam: offset }) => {
      return await api.transaction.getPaginatedWithBudgets({
        limit: params?.limit || 5,
        offset
      }, filterBy)
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default usePaginatedTransactionsWithBudgets
