import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useRemoveSubpayment = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['removeSubpayment', transactionId],
    mutationFn: async ({ transactionId, subpaymentId }: {
      transactionId: string
      subpaymentId: string
    }) => api.payment.removeSubpayment(transactionId, subpaymentId),
    onSuccess: ({ budgetId, transactionId, transaction }) => {
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', { id: budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['budget', { id: transaction.budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transaction', { id: transactionId }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', { type: transaction.type }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', 'controlled'] })

      // payment
      queryClient.invalidateQueries({ queryKey: ['subpayments', { budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['subpayments', { transactionId }] })
    }
  })
}

export default useRemoveSubpayment
