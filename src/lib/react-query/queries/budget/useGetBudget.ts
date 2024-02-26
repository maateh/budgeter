import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useGetBudget = (budgetId: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['getBudget', budgetId],
    queryFn: async () => await api.budget.getById(budgetId),
  })
}

export default useGetBudget
