import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import Transaction from "@/models/Transaction"

export const useLoadBudgetsQuery = () => {
  const { api } = useAPI()
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => api.budget.findAll()
  })
}

export const useSaveTransactionMutation = () => {  
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      await api.budget.addTransactions(transaction.budgetId, [transaction])
      return await api.transaction.save(transaction)
    },
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'find', transaction.id] })
      
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', transaction.budgetId] })
    }
  })
}
