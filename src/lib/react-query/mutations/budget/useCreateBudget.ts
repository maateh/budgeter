import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetFieldValues } from "@/components/form/budget/types"

const useCreateBudget = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createBudget'],
    mutationFn: async (data: BudgetFieldValues) => await api.budget.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
    }
  })
}

export default useCreateBudget
