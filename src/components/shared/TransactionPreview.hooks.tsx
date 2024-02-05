import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import API from "@/api"

// models
import Transaction from "@/models/Transaction"
import Budget from "@/models/Budget"

export const useDeleteTransactionMutation = (id: string, budgetId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transaction', 'delete', id],
    mutationFn: (id: string) => API.transaction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'findAll'] })
    }
  })
}

export const useAcceptTransactionMutation = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transaction', 'save', id],
    mutationFn: ({ transaction, budget }: {
      transaction: Transaction
      budget: Budget
    }) => {
      API.budget.save(budget)
      return API.transaction.save(transaction)
    },
    onSuccess: ({ id, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'find', id] })
    }
  })
}
