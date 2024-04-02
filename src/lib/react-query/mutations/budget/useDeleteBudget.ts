import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteBudget = (budgetId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteBudget', budgetId],
    mutationFn: async (id: string) => await api.budget.delete(id),
    onSuccess: ({ id }) => {
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', { id }] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })

      // note
      queryClient.invalidateQueries({ queryKey: ['note', { budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['notes', { budgetId: id }] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      
      // payment
      queryClient.invalidateQueries({ queryKey: ['payments', { budgetId: id }] })
    }
  })
}

export default useDeleteBudget
