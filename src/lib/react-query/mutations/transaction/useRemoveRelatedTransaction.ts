import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useRemoveRelatedTransaction = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['removeRelatedTransaction', transactionId],
    mutationFn: async ({ id, relatedId }: {
      id: string
      relatedId: string
    }) => await api.transaction.removeRelated(id, relatedId),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
    }
  })
}

export default useRemoveRelatedTransaction
