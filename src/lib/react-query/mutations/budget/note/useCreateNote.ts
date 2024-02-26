import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNoteFieldValues } from "@/components/form/budget/types"

const useCreateNote = (budgetId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createNote', budgetId],
    mutationFn: async ({ budgetId, data }: {
      budgetId: UUID
      data: BudgetNoteFieldValues
    }) => await api.budget.createNote(budgetId, data),
    onSuccess: ({ budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getNotes', budgetId] })
    }
  })
}

export default useCreateNote
