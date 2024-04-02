import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget, QueryOptions } from "@/services/api/types"

const useBudgets = ({ params, filter }: QueryOptions<Budget> = {}) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useQuery({
    queryKey: ['budgets', filterBy, excludeBy],
    queryFn: async () => {
      const { data } = await api.budget.get({ params, filter })
      return data
    }
  })
}

export default useBudgets
