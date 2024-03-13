import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Budget, PaginationParams } from "@/services/api/types"

type BudgetsQueryOptions = {
  params?: PaginationParams
  filterBy?: Partial<Budget>
}

const useBudgets = ({ params, filterBy }: BudgetsQueryOptions = {}) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => await api.budget.get(params, filterBy)
  })
}

export default useBudgets
