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
    }) => api.transaction.removeSubpayment(transactionId, paymentId),
    onSuccess: ({ id, budgetId, type }) => {
      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget', id] })
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', { type }] })

      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedBudgets'] })
    }
  })
}

export default useRemoveSubpayment
