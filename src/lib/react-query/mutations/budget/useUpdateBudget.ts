import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetFieldValues } from "@/components/form/budget/types"

const useUpdateBudget = (budgetId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateBudget', budgetId],
    mutationFn: async ({ id, data }: {
      id: UUID
      data: BudgetFieldValues
    }) => await api.budget.update(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ['getBudgets'] })
      queryClient.invalidateQueries({ queryKey: ['getBudget', id] })
    }
  })
}

export default useUpdateBudget
