import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useBudget = (budgetId?: string) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budget', { id: budgetId }],
    queryFn: async () => await api.budget.getById(budgetId!),
    enabled: !!budgetId
  })
}

export default useBudget
