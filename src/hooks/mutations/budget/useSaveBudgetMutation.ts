import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useSaveBudgetMutation = (budgetId?: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveBudget', budgetId || 'create'],
    mutationFn: api.budget.save,
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budget.id] })
    }
  })
}

export default useSaveBudgetMutation
