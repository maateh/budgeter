import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import { FieldValues } from "@/components/form/budget/types"

const useSaveBudgetMutation = (budgetId?: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveBudget', budgetId || 'create'],
    mutationFn: (data: FieldValues['budget']) => {
      if (budgetId) {
        return api.budget.update(budgetId, data)
      }
      return api.budget.create(data)
    },
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budget.id] })
    }
  })
}

export default useSaveBudgetMutation
