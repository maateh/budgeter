import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { SubpaymentFieldValues } from "@/components/form/subpayment/types"

const useAddSubpayment = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createSubpayment', transactionId],
    mutationFn: async ({ id, data }: {
      id: string
      data: SubpaymentFieldValues
    }) => api.payment.addSubpayment(id, data),
    onSuccess: ({ id, budgetId, type }) => {
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', { id: budgetId }] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
      queryClient.invalidateQueries({ queryKey: ['transactions', { type }] })

      // payment
      queryClient.invalidateQueries({ queryKey: ['payments', { budgetId }] })

    }
  })
}

export default useAddSubpayment
