import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteBudget = (budgetId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteBudget', budgetId],
    mutationFn: async (id: UUID) => await api.budget.delete(id),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', id] })
    }
  })
}

export default useDeleteBudget
