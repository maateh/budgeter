import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// validations
import { TransactionValidation } from "@/lib/validation"

const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: async (data: z.infer<typeof TransactionValidation>) => {
      return await api.transaction.create(data)
    },
    onSuccess: ({ budgetId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions', status] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId, 'transactions', status] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useCreateTransactionMutation
