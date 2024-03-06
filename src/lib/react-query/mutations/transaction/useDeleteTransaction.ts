import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteTransaction = (transactionId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: async ({ id, undoPayment = true }: {
      id: UUID
      undoPayment?: boolean
    }) => await api.transaction.delete(id, undoPayment),
    onSuccess: ({ id ,type, processed, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getTransactionWithBudget', id] })
      queryClient.invalidateQueries({ queryKey: ['getTransactionsWithBudgets', type, processed, budgetId] })
      queryClient.invalidateQueries({ queryKey: ['getTransactionsWithBudgets', type, processed, 'all'] })

      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', budgetId] })
    }
  })
}

export default useDeleteTransaction
