import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useGetNoteWithBudget = (budgetId: UUID, noteId: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['getNoteWithBudget', budgetId, noteId],
    queryFn: async () => await api.budgetNote.getNoteWithBudget(budgetId, noteId),
  })
}

export default useGetNoteWithBudget
