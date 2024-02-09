import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

export const useLoadBudgetQuery = () => {
  const { api } = useAPI()
  const { id } = useParams()
  if (!id) throw new Error('Budget ID not defined!')

  return useQuery({
    queryKey: ['budget', 'find', id],
    queryFn: () => api.budget.find(id)
  })
}
