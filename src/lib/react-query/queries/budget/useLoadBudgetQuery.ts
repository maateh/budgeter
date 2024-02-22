import { UUID } from "crypto"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useLoadBudgetQuery = () => {
  const { id } = useParams() as { id: UUID }
  const { api } = useAPI()
  
  if (!id) throw new Error('Budget ID not defined!')

  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => await api.budget.get(id)
  })
}

export default useLoadBudgetQuery
