import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget, QueryOptions } from "@/services/api/types"

const useBudgets = ({ params, filterBy }: QueryOptions<Budget> = {}) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data } = await api.budget.get({ params, filterBy })
      return data
    }
  })
}

export default useBudgets
