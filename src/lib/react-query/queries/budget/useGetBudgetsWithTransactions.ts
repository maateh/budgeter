import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { PaginationParams } from "@/services/api/types"

type BudgetsWithTransactionsProps = {
  recentTransactionsLimit: number
  paginationLimit: PaginationParams['limit']
}

const useGetBudgetsWithTransactions = ({
  recentTransactionsLimit, paginationLimit
}: BudgetsWithTransactionsProps) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['getBudgetsWithTransactions'],
    queryFn: async ({ pageParam: offset }) => {
      return await api.budget.getBudgetsWithTransactions(
        recentTransactionsLimit,
        {},
        { processed: true },
        { offset, limit: paginationLimit })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useGetBudgetsWithTransactions
