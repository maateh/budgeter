import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// api
import API from "@/api"

// types
import Transaction from "@/models/Transaction"

export const useLoadBudgetsQuery = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => API.budget.findAll()
  })
}

export const useSaveTransactionMutation = () => {  
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      await API.budget.addTransactions(transaction.budgetId, [transaction])
      return await API.transaction.save(transaction)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }
  })
}
