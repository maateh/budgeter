import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteTransaction = (transactionId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: async (id: UUID) => await api.transaction.delete(id),
    onSuccess: ({ type, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getTransactionsWithBudgets', type, budgetId] })
      queryClient.invalidateQueries({ queryKey: ['getTransactionsWithBudgets', type, 'all'] })

      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', budgetId] })
    }
  })
}

export default useDeleteTransaction
