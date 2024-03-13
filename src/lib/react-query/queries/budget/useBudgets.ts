import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useBudgets = () => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      return await api.budget.get({ offset: 0, limit: 6 })
    }
  })
}

export default useBudgets
