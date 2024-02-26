import { UUID } from "crypto"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNote } from "@/services/api/types"

const useUpdateNoteStatus = (budgetId: UUID, noteId: UUID) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateNoteStatus', budgetId, noteId],
    mutationFn: async ({ budgetId, noteId, status }: {
      budgetId: UUID
      noteId: UUID
      status: BudgetNote['status']
    }) => await api.budget.updateNoteStatus(budgetId, noteId, status),
    onSuccess: ({ budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['getNotes', budgetId] })
    }
  })
}

export default useUpdateNoteStatus
