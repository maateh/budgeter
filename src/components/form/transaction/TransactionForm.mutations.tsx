import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import Transaction from "@/models/Transaction"

export const useSaveTransactionMutation = () => {  
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transaction', 'save'],
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
