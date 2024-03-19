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
      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget', id] })
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', type] })

      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useUpdateTransactionStatus
