import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget, QueryOptions } from "@/services/api/types"

const useBudgetsPagination = ({ params, filter, sortBy }: QueryOptions<Budget>) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useInfiniteQuery({
    queryKey: ['budgets', filterBy, excludeBy, sortBy],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.get({
        params: { ...params, limit: params?.limit || 20, offset },
        filter, sortBy
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useBudgetsPagination
