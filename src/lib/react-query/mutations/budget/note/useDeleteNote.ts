import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useDeleteNote = (budgetId: UUID, noteId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['deleteNote', budgetId, noteId],
    mutationFn: async ({ budgetId, noteId }: {
      budgetId: UUID
      noteId: UUID
    }) => await api.budget.deleteNote(budgetId, noteId),
    onSuccess: ({ budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getNotes', budgetId] })
    }
  })
}

export default useDeleteNote
