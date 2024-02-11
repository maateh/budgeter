import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import Budget, { BudgetNote } from "@/models/Budget"

export const useSaveNoteMutation = (budgetId: string) => {
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget', 'save', budgetId],
    mutationFn: async ({ budget, note }: { budget: Budget; note: BudgetNote }) => {
      budget.saveNote(note)
      return await api.budget.save(budget)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['budget', 'find', budgetId]
      })
    }
  })
}
