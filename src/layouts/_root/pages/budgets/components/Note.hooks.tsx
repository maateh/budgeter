import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import Budget from "@/models/Budget"

export const useChangeNoteStatusMutation = (budgetId: string) => {
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget', 'save', budgetId],
    mutationFn: async ({ budget, noteId, status }: {
      budget: Budget
      noteId: string
      status: 'open' | 'closed'
    }) => {
      budget.changeNoteStatus(noteId, status)
      return await api.budget.save(budget)
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({
        queryKey: ['budget', 'find', id]
      })
    }
  })
}
