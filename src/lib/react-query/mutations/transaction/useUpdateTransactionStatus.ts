import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
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
    onSuccess: ({ id, processed, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getTransactionWithBudget', id] })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'default' as Transaction['type'], !processed, budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'default' as Transaction['type'], !processed, 'all']
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'borrow' as Transaction['type'], !processed, budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', 'borrow' as Transaction['type'], !processed, 'all']
      })

      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', budgetId] })
    }
  })
}

export default useUpdateTransactionStatus
