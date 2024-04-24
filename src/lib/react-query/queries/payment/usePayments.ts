import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Payment, QueryOptions } from "@/services/api/types"

const usePayments = ({ params, filter, sortBy }: QueryOptions<Payment> = {}) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useQuery({
    queryKey: ['payments', filterBy, excludeBy, sortBy],
    queryFn: async () => {
      const { data } = await api.payment.get({ params, filter, sortBy })
      return data
    }
  })
}

export default usePayments
