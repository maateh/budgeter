import { UseQueryOptions, useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Balance } from "@/services/api/types"

const useSummarizedBalance = (currency: string, options?: Omit<UseQueryOptions<Balance>, 'queryKey' | 'queryFn'>) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgets', 'summarizedBalance'],
    queryFn: async () => await api.budget.getSummarizedBalance(currency),
    ...options
  })
}

export default useSummarizedBalance
