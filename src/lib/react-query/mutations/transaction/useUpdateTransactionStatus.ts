import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useUpdateTransactionStatus = (transactionId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateTransactionStatus', transactionId],
    mutationFn: async ({ id, processed }: {
      id: UUID
      processed: boolean
    }) => await api.transaction.updateStatus(id, processed),
    onSuccess: ({ id, type, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget', id] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', type] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['paginatedBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useUpdateTransactionStatus
