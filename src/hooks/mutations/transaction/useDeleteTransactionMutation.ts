import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useDeleteTransactionMutation = (transactionId: string, budgetId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: api.transaction.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useDeleteTransactionMutation
