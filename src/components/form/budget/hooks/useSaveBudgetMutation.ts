import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import Budget from "@/models/Budget"

const useSaveBudgetMutation = () => {
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget', 'save'],
    mutationFn: (budget: Budget) => api.budget.save(budget),
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', budget.id] })
    }
  })
}

export default useSaveBudgetMutation
