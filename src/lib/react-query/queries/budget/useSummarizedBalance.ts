import { UseQueryOptions, useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Balance, Budget, Filter } from "@/services/api/types"

const useSummarizedBalance = (
  currency: string,
  filterBy?: Filter<Budget>,
  options?: Omit<UseQueryOptions<Balance>, 'queryKey' | 'queryFn'>
) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgets', 'summarizedBalance', currency, filterBy],
    queryFn: async () => await api.budget.getSummarizedBalance(currency, filterBy),
    ...options
  })
}

export default useSummarizedBalance
