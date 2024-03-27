import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { SubpaymentFieldValues } from "@/components/form/subpayment/types"

const useCreateSubpayment = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createSubpayment', transactionId],
    mutationFn: async ({ id, data }: {
      id: string
      data: SubpaymentFieldValues
    }) => api.transaction.createSubpayment(id, data),
    onSuccess: ({ id, budgetId, type }) => {
      queryClient.invalidateQueries({ queryKey: ['transactionWithBudget', id] })
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', { type }] })

      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedBudgets'] })
    }
  })
}

export default useCreateSubpayment
