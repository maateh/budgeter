import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNote } from "@/services/api/types"

const useUpdateNoteStatus = (budgetId: string, noteId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateNoteStatus', budgetId, noteId],
    mutationFn: async ({ budgetId, noteId, status }: {
      budgetId: string
      noteId: string
      status: BudgetNote['status']
    }) => await api.budgetNote.updateStatus(budgetId, noteId, status),
    onSuccess: ({ id, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['noteWithBudget', budgetId, id] })
      queryClient.invalidateQueries({ queryKey: ['paginatedNotesByStatus', budgetId] })
    }
  })
}

export default useUpdateNoteStatus
