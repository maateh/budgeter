import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import API from "@/api"

// types
import Budget from "@/models/Budget"

export const useSaveBudgetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['saveBudget'],
    mutationFn: (budget: Budget) => API.budget.save(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['budgets']
      })
    }
  })
}
