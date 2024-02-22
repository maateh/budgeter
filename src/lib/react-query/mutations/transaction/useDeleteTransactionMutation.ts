import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useDeleteTransactionMutation = (transactionId: UUID, budgetId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: api.transaction.delete,
    onSuccess: () => {
      // FIXME: send back document after deletion
      // queryClient.invalidateQueries({ queryKey: ['transactions', status] })
      // queryClient.invalidateQueries({ queryKey: ['budget', budgetId, 'transactions', status] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useDeleteTransactionMutation
