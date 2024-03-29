import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"

const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: async (data: TransactionFieldValues) => await api.transaction.create(data),
    onSuccess: ({ type, processed, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', { type, processed }] })

      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedBudgets'] })
    }
  })
}

export default useCreateTransaction
