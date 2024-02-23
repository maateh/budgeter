import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import { FieldValues } from "@/components/form/budget/types"

const useSaveNoteMutation = (budgetId: UUID, noteId?: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['saveNote', budgetId, noteId || 'create'],
    mutationFn: (data: FieldValues['note']) => {
      if (noteId) {
        return api.budget.editNoteText(budgetId, noteId, data)
      }
      return api.budget.addNote(budgetId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useSaveNoteMutation
