import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { PaginationParams, Payment } from "@/services/api/types"

type TransactionsQueryOptions = {
  params?: PaginationParams
  filterBy?: Partial<Payment>
}

const usePayments = ({ params, filterBy }: TransactionsQueryOptions = {}) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['payments', { filterBy }],
    queryFn: async () => {
      const { data } = await api.payment.get(params, filterBy)
      return data
    }
  })
}

export default usePayments
