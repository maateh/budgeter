import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Payment, QueryOptions } from "@/services/api/types"

const usePayments = ({ params, filter }: QueryOptions<Payment> = {}) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useQuery({
    queryKey: ['payments', filterBy, excludeBy],
    queryFn: async () => {
      const { data } = await api.payment.get({ params, filter })
      return data
    }
  })
}

export default usePayments
