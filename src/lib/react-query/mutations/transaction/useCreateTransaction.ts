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
    mutationFn: async ({ data, executePayment = true }: {
      data: TransactionFieldValues
      executePayment?: boolean
    }) => await api.transaction.create(data, executePayment),
    onSuccess: ({ type, processed, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', type, processed] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['paginatedBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useCreateTransaction
