import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useUpdateTransactionStatus = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateTransactionStatus', transactionId],
    mutationFn: async ({ id, processed }: {
      id: string
      processed: boolean
    }) => await api.transaction.updateStatus(id, processed),
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

export default useUpdateTransactionStatus
