import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useDeleteTransactionMutation = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: api.transaction.delete,
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      // queryClient.invalidateQueries({ queryKey: ['transaction', transaction.id] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', transaction.budgetId] })
    }
  })
}

export default useDeleteTransactionMutation
