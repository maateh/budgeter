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
    onSuccess: ({ budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', budgetId] })
    }
  })
}

export default useCreateTransaction
