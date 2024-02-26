import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNoteFieldValues } from "@/components/form/budget/types"

const useUpdateNoteText = (budgetId: UUID, noteId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateNoteText', budgetId, noteId],
    mutationFn: async ({ budgetId, noteId, data }: {
      budgetId: UUID
      noteId: UUID
      data: BudgetNoteFieldValues
    }) => await api.budget.updateNoteText(budgetId, noteId, data),
    onSuccess: ({ budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getNotes', budgetId] })
    }
  })
}

export default useUpdateNoteText
