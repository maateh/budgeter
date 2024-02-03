import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import API from "@/api"

// models
import Transaction from "@/models/Transaction"

export const useDeleteTransactionMutation = (transaction: Transaction) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transaction', 'delete', transaction],
    mutationFn: async (transaction: Transaction) => {
      return await API.transaction.delete(transaction.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', transaction.budgetId] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'findAll'] })
    }
  })
}
