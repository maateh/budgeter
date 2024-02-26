import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNoteFieldValues } from "@/components/form/budget/types"

const useSaveNote = (budgetId: UUID, noteId?: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveNote', noteId ? 'create' : 'update', budgetId, noteId],
    mutationFn: async ({ budgetId, noteId, data }: {
      budgetId: UUID
      noteId?: UUID
      data: BudgetNoteFieldValues
    }) => {
      if (noteId) {
        return await api.budgetNote.updateText(budgetId, noteId, data)
      }
      return await api.budgetNote.create(budgetId, data)
    },
    onSuccess: ({ budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getNotesByBudget', budgetId] })
    }
  })
}

export default useSaveNote
