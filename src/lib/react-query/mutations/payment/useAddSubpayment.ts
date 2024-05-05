import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { SubpaymentFieldValues } from "@/components/form/subpayment/types"

const useAddSubpayment = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['addSubpayment', transactionId],
    mutationFn: async ({ id, data }: {
      id: string
      data: SubpaymentFieldValues
    }) => api.payment.addSubpayment(id, data),
    onSuccess: ({ id, budgetId, type }) => {
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', { id: budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', { type }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', 'controlled'] })

      // payment
      queryClient.invalidateQueries({ queryKey: ['subpayments', { budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['subpayments', { transactionId: id, isSubpayment: true }] })
    }
  })
}

export default useAddSubpayment
