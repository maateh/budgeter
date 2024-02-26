import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useGetBudgets = () => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['getBudgets'],
    queryFn: async () => await api.budget.get(),
  })
}

export default useGetBudgets
