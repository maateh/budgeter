import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { QueryOptions, Transaction } from "@/services/api/types"

const useTransactions = ({ params, filter, sortBy }: QueryOptions<Transaction> = {}) => {
  const { api } = useAPI()
  
  const { filterBy, excludeBy } = filter || {}

  return useQuery({
    queryKey: ['transactions', filterBy, excludeBy, sortBy],
    queryFn: async () => {
      const { data } = await api.transaction.get({ params, filter, sortBy })
      return data
    }
  })
}

export default useTransactions
