import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"
import { Transaction } from "@/services/api/types"

const useChangeTransactionStatusMutation = (transactionId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateTransaction', transactionId, 'status'],
    mutationFn: async ({ id, status }: {
      id: UUID
      status: Transaction['status']
    }) => {
      return await api.transaction.changeStatus(id, status)
    },
    onSuccess: ({ budgetId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions', status] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId, 'transactions', status] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useChangeTransactionStatusMutation
