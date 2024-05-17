import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { QueryOptions, Transaction } from "@/services/api/types"

const useTransactionsPagination = ({ params, filter, sortBy }: QueryOptions<Transaction>) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useInfiniteQuery({
    queryKey: ['transactions', filterBy, excludeBy, sortBy, 'pagination'],
    queryFn: async ({ pageParam: offset }) => {
      return await api.transaction.getWithBudget({
        params: { ...params, limit: params?.limit || 20, offset },
        filter, sortBy
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default useTransactionsPagination
