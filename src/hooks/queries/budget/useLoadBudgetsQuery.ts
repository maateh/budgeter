import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useLoadBudgetsQuery = () => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['budgets'],
    queryFn: api.budget.findAll
  })
}

export default useLoadBudgetsQuery
