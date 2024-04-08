import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget, QueryOptions } from "@/services/api/types"

type BudgetsPaginationOptions = QueryOptions<Budget> & {
  disableScrolling?: boolean
}

const useBudgetsPagination = ({ params, filter, disableScrolling }: BudgetsPaginationOptions) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useInfiniteQuery({
    queryKey: ['budgets', filterBy, excludeBy, disableScrolling],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.get({
        params: { ...params, limit: params?.limit || 20, offset },
        filter
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useBudgetsPagination
