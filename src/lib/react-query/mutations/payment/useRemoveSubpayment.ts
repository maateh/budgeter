import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useRemoveSubpayment = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['removeSubpayment', transactionId],
    mutationFn: async ({ transactionId, paymentId }: {
      transactionId: string
      paymentId: string
    }) => api.payment.removeSubpayment(transactionId, paymentId),
    onSuccess: ({ id, budgetId, type }) => {
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', { id: budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', { type }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', 'controlled'] })

      // payment
      queryClient.invalidateQueries({ queryKey: ['payments', { budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['payments', { transactionId: id, isSubpayment: true }] })
    }
  })
}

export default useRemoveSubpayment
