import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"
import { Transaction } from "@/services/api/types"

const useChangeTransactionStatusMutation = (transactionId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateTransaction', transactionId, 'status'],
    mutationFn: ({ id, status }: {
      id: UUID
      status: Transaction['status']
    }) => {
      return api.transaction.changeStatus(id, status)
    },
    onSuccess: ({ id, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', id] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useChangeTransactionStatusMutation
