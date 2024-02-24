import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

const useDeleteTransactionMutation = (transaction: Transaction, budgetId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transaction.id],
    mutationFn: async (id: UUID) => await api.transaction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', transaction.status] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId, 'transactions', transaction.status] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useDeleteTransactionMutation
