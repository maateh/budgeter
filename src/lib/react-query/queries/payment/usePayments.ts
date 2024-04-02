import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Payment, QueryOptions } from "@/services/api/types"

const usePayments = ({ params, filterBy }: QueryOptions<Payment> = {}) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['payments', filterBy],
    queryFn: async () => {
      const { data } = await api.payment.get({ params, filterBy })
      return data
    }
  })
}

export default usePayments
