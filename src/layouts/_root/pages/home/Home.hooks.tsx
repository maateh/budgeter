import { useQueries } from "@tanstack/react-query"

// api
import API from "@/api"

export const useDashboardQuery = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['budgets'],
        queryFn: () => API.budget.findAll()
      },
      {
        queryKey: ['transactions'],
        queryFn: () => API.transaction.findAll()
      }
    ]
  })
}
