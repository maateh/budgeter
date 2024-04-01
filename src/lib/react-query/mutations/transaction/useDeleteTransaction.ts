import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteTransaction = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: async (id: string) => await api.transaction.delete(id),
    onSuccess: ({ id ,type, processed, budgetId }) => {
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget', id] })
      queryClient.invalidateQueries({ queryKey: ['transactions', { type, processed }] })
      
      // payment
      queryClient.invalidateQueries({ queryKey: ['payments', { budgetId }] })
    }
  })
}

export default useDeleteTransaction
