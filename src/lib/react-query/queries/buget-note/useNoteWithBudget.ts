import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useNoteWithBudget = (budgetId: UUID, noteId: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['noteWithBudget', budgetId, noteId],
    queryFn: async () => await api.budgetNote.getNoteWithBudget(budgetId, noteId),
  })
}

export default useNoteWithBudget
