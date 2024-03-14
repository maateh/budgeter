import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { PaginationParams } from "@/services/api/types"

type PaginatedBudgetsQueryOptions = {
  params?: PaginationParams
  disableScrolling?: boolean
}

const usePaginatedBudgets = ({ params, disableScrolling }: PaginatedBudgetsQueryOptions = {}) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['paginatedBudgets', disableScrolling],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.getPaginated({
        limit: params?.limit || 4,
        offset
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default usePaginatedBudgets
