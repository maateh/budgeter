import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"
import { Transaction } from "@/services/api/types"

const useUpdateTransactionStatus = (transactionId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateTransactionStatus', transactionId],
    mutationFn: async ({ id, processed }: {
      id: UUID
      processed: boolean
    }) => await api.transaction.updateStatus(id, processed),
    onSuccess: ({ budgetId }) => {
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'default' as Transaction['type'], budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'default' as Transaction['type'], 'all']
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'temporary' as Transaction['type'], budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'temporary' as Transaction['type'], 'all']
      })
    }
  })
}

export default useUpdateTransactionStatus
