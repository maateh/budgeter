import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useGetBudgetsWithTransactions = (transactionLimit: number) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['getBudgetsWithTransactions'],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.getBudgetsWithTransactions(
        transactionLimit,
        {},
        { processed: true },
        { offset, limit: 5 })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useGetBudgetsWithTransactions
