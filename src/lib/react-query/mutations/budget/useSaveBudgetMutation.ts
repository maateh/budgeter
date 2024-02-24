import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { FieldValues } from "@/components/form/budget/types"

const useSaveBudgetMutation = (budgetId?: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveBudget', budgetId || 'create'],
    mutationFn: async (data: FieldValues['budget']) => {
      if (budgetId) {
        return await api.budget.update(budgetId, data)
      }
      return await api.budget.create(data)
    },
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budget.id] })
    }
  })
}

export default useSaveBudgetMutation
