import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget, QueryOptions } from "@/services/api/types"

type BudgetsPaginationOptions = QueryOptions<Budget> & {
  disableScrolling?: boolean
}

const useBudgetsPagination = ({ params, filterBy, disableScrolling }: BudgetsPaginationOptions) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['budgets', filterBy, disableScrolling],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.get({
        params: { limit: params?.limit || 4, offset },
        filterBy
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useBudgetsPagination
