import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import API from "@/api"

// types
import Budget from "@/models/Budget"

export const useSaveBudgetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget', 'save'],
    mutationFn: (budget: Budget) => API.budget.save(budget),
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', budget.id] })
    }
  })
}
