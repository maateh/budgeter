import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Payment, QueryOptions } from "@/services/api/types"

const usePaymentsPagination = ({ params, filter, sortBy }: QueryOptions<Payment> = {}) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useInfiniteQuery({
    queryKey: ['payments', filterBy, excludeBy, sortBy, 'pagination'],
    queryFn: async ({ pageParam: offset }) => {
      return await api.payment.get({
        params: { ...params, limit: params?.limit || 20, offset },
        filter, sortBy
      })
    },
    initialPageParam: params?.offset || 0,
    getNextPageParam: (lastPage) => lastPage.nextPageOffset
  })
}

export default usePaymentsPagination
