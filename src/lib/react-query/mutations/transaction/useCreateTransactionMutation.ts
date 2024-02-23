import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: api.transaction.create,
    onSuccess: ({ budgetId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions', status] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId, 'transactions', status] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useCreateTransactionMutation
