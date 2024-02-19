import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useDeleteBudgetMutation = (budgetId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteBudget', budgetId],
    mutationFn: api.budget.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      // queryClient.invalidateQueries({ queryKey: ['budget', budget.id] })
      
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }
  })
}

export default useDeleteBudgetMutation
