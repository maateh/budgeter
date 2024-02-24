import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useLoadBudgetsQuery = () => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgets'],
    queryFn: api.budget.getAll
  })
}

export default useLoadBudgetsQuery
