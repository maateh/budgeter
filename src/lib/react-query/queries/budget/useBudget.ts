import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useBudget = (budgetId: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budget', budgetId],
    queryFn: async () => await api.budget.getById(budgetId),
    enabled: !!budgetId
  })
}

export default useBudget
