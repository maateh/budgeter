import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// models
import Transaction from "@/models/Transaction"
import Budget from "@/models/Budget"

export const useDeleteTransactionMutation = (id: string, budgetId: string) => {
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transaction', 'delete', id],
    mutationFn: (id: string) => api.transaction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'findAll'] })
    }
  })
}

export const useChangeTransactionStatusMutation = (id: string) => {
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transaction', 'save', id],
    mutationFn: ({ transaction, budget }: {
      transaction: Transaction
      budget: Budget
    }) => {
      api.budget.save(budget)
      return api.transaction.save(transaction)
    },
    onSuccess: ({ id, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'find', id] })
    }
  })
}
