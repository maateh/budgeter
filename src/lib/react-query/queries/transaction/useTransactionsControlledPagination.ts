import { keepPreviousData, useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { QueryOptions, Transaction } from "@/services/api/types"

const useTransactionsControlledPagination = ({ params, filter }: QueryOptions<Transaction> = {}) => {
  const { api } = useAPI()
  
  const { filterBy, excludeBy } = filter || {}

  return useQuery({
    queryKey: ['transactions', filterBy, excludeBy, params],
    queryFn: async () => {
      return await api.transaction.getWithBudget({ params, filter })
    },
    placeholderData: keepPreviousData
  })
}

export default useTransactionsControlledPagination
