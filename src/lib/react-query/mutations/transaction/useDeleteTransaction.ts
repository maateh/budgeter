import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteTransaction = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteTransaction', transactionId],
    mutationFn: async ({ id, undoPayment = true }: {
      id: string
      undoPayment?: boolean
    }) => await api.transaction.delete(id, undoPayment),
    onSuccess: ({ id ,type, processed, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget', id] })
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', type, processed] })

      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useDeleteTransaction
