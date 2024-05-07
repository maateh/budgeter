import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { QueryOptions, Subpayment } from "@/services/api/types"

const useSubpayments = ({ params, filter, sortBy }: QueryOptions<Subpayment> = {}) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useQuery({
    queryKey: ['subpayments', filterBy, excludeBy, sortBy],
    queryFn: async () => {
      const { data } = await api.payment.get({ params, filter, sortBy })
      return data
    }
  })
}

export default useSubpayments
