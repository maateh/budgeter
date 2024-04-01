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
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transactions', { type, processed }] })

      // payment
      queryClient.invalidateQueries({ queryKey: ['payments', { budgetId }] })
    }
  })
}

export default useCreateTransaction
