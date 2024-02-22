import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

const useChangeNoteStatusMutation = (budgetId: UUID, noteId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateNote', budgetId, noteId, 'status'],
    mutationFn: ({ budgetId, noteId, status }: {
      budgetId: UUID
      noteId: UUID
      status: 'open' | 'closed'
    }) => {
      return api.budget.changeNoteStatus(budgetId, noteId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useChangeNoteStatusMutation
