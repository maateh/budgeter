import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useSaveTransactionMutation = (transactionId?: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveTransaction', transactionId || 'create'],
    mutationFn: api.transaction.save,
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', transaction.id] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', transaction.budgetId] })
    }
  })
}

export default useSaveTransactionMutation
