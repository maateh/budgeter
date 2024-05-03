import { UseQueryOptions, useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget } from "@/services/api/types"

const useBudget = (budgetId: string, options?: Omit<UseQueryOptions<Budget>, 'queryKey' | 'queryFn'>) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budget', { id: budgetId }],
    queryFn: async () => await api.budget.getById(budgetId),
    ...options
  })
}

export default useBudget
