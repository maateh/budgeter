import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteTransaction = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: async ({ id, removeRelated }: {
      id: string
      removeRelated?: boolean
    }) => await api.transaction.delete(id, removeRelated),
    onSuccess: ({ id, type, budgetId }) => {
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', { id: budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', { type }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', 'controlled'] })
      
      // payment
      queryClient.invalidateQueries({ queryKey: ['subpayments', { budgetId }] })
    }
  })
}

export default useDeleteTransaction
