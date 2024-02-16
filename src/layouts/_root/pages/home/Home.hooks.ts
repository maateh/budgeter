import { useQueries } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

export const useDashboardQuery = () => {
  const { api } = useAPI()

  return useQueries({
    queries: [
      {
        queryKey: ['budget', 'findAll'],
        queryFn: () => api.budget.findAll()
      },
      {
        queryKey: ['transaction', 'findAll'],
        queryFn: () => api.transaction.findAll()
      }
    ]
  })
}
