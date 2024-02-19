import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useLoadBudgetQuery = () => {
  const { id } = useParams()
  const { api } = useAPI()
  
  if (!id) throw new Error('Budget ID not defined!')

  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => await api.budget.find(id)
  })
}

export default useLoadBudgetQuery
