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
    }) => await api.budgetNote.delete(budgetId, noteId),
    onSuccess: ({ id, budgetId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['noteWithBudget', budgetId, id] })
      queryClient.invalidateQueries({ queryKey: ['paginatedNotesByStatus', budgetId, status] })
    }
  })
}

export default useDeleteNote
