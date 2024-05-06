import { useInfiniteQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { QueryOptions, Subpayment } from "@/services/api/types"

const useSubpaymentsPagination = ({ params, filter, sortBy }: QueryOptions<Subpayment> = {}) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useInfiniteQuery({
    queryKey: ['subpayments', filterBy, excludeBy, sortBy, 'pagination'],
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

export default useSubpaymentsPagination
