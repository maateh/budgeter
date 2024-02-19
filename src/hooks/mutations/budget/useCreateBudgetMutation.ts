import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useCreateBudgetMutation = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createBudget'],
    mutationFn: api.budget.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    }
  })
}

export default useCreateBudgetMutation
