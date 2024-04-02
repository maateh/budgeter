import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useNoteWithBudget = (budgetId: string, noteId: string) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['note', { id: noteId, budgetId }],
    queryFn: async () => await api.budgetNote.getByIdWithBudget(budgetId, noteId),
  })
}

export default useNoteWithBudget
