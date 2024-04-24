import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget, QueryOptions } from "@/services/api/types"

const useBudgets = ({ params, filter, sortBy }: QueryOptions<Budget> = {}) => {
  const { api } = useAPI()

  const { filterBy, excludeBy } = filter || {}

  return useQuery({
    queryKey: ['budgets', filterBy, excludeBy, sortBy],
    queryFn: async () => {
      const { data } = await api.budget.get({ params, filter, sortBy })
      return data
    }
  })
}

export default useBudgets
