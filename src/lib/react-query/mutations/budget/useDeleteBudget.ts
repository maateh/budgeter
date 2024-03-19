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
      queryClient.invalidateQueries({ queryKey: ['budget', id] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['paginatedBudgets'] })

      queryClient.invalidateQueries({ queryKey: ['noteWithBudget', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedNotesByStatus', id] })

      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget'] })
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', id] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets'] })
    }
  })
}

export default useDeleteBudget
