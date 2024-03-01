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
    onSuccess: ({ type, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getTransactionsWithBudgets', type, budgetId] })
      queryClient.invalidateQueries({ queryKey: ['getTransactionsWithBudgets', type, 'all'] })

      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', budgetId] })
    }
  })
}

export default useCreateTransaction
