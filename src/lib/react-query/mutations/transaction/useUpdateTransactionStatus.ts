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
      queryClient.invalidateQueries({ queryKey: ['getTransactionWithBudget', id] })

      // FIXME: this must be reworked
      // https://github.com/maateh/budgeter/issues/19
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, true, budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, false, budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, true, 'all']
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, false, 'all']
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, true, budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, false, budgetId]
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, true, 'all']
      })
      queryClient.invalidateQueries({
        queryKey: ['getTransactionsWithBudgets', type, false, 'all']
      })

      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', budgetId] })
    }
  })
}

export default useUpdateTransactionStatus
