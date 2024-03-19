import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNoteFieldValues } from "@/components/form/budget-note/types"

const useSaveNote = (budgetId: string, noteId?: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveNote', noteId ? 'update' : 'create', budgetId, noteId],
    mutationFn: async ({ budgetId, noteId, data }: {
      budgetId: string
      noteId?: string
      data: BudgetNoteFieldValues
    }) => {
      if (noteId) {
        return await api.budgetNote.updateText(budgetId, noteId, data)
      }
      return await api.budgetNote.create(budgetId, data)
    },
    onSuccess: ({ id, budgetId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['noteWithBudget', budgetId, id] })
      queryClient.invalidateQueries({ queryKey: ['paginatedNotesByStatus', budgetId, status] })
    }
  })
}

export default useSaveNote
