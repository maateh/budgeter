import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useBudgetsPagination = () => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['budgetsPagination'],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.get({ offset, limit: 6 })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useBudgetsPagination
