import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: api.transaction.save,
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', transaction.budgetId] })
    }
  })
}

export default useCreateTransactionMutation
