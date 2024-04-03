import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { RelatedTransactionsFieldValues } from "@/components/form/related-transactions/types"

const useAddRelatedTransactions = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['addRelatedTransactions', transactionId],
    mutationFn: async ({ id, data }: {
      id: string
      data: RelatedTransactionsFieldValues
    }) => await api.transaction.addRelated(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
    }
  })
}

export default useAddRelatedTransactions
