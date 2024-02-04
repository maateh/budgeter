import { useQueries } from "@tanstack/react-query"

// api
import API from "@/api"

export const useDashboardQuery = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['budget', 'findAll'],
        queryFn: () => API.budget.findAll()
      },
      {
        queryKey: ['transaction', 'findAll'],
        queryFn: () => API.transaction.findAll('processed')
      }
    ]
  })
}
