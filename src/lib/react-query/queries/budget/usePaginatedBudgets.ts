import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const usePaginatedBudgets = () => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['paginatedBudgets'],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.getPaginated({ offset, limit: 6 })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default usePaginatedBudgets
