import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { FieldValues } from "@/components/form/budget/types"

const useSaveNoteMutation = (budgetId: UUID, noteId?: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveNote', budgetId, noteId || 'create'],
    mutationFn: async (data: FieldValues['note']) => {
      if (noteId) {
        return await api.budget.editNoteText(budgetId, noteId, data)
      }
      return await api.budget.addNote(budgetId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useSaveNoteMutation
