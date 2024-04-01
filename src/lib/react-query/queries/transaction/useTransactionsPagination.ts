import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { QueryOptions, Transaction } from "@/services/api/types"

const useTransactionsPagination = ({ params, filterBy }: QueryOptions<Transaction>) => {
  const { api } = useAPI()

  return useInfiniteQuery({
    queryKey: ['transactions', filterBy],
    queryFn: async ({ pageParam: offset }) => {
      return await api.transaction.getWithBudget({
        params: { limit: params?.limit || 5, offset },
        filterBy
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useTransactionsPagination
