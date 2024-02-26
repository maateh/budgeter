import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useGetNotes = (budgetId: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['getNotesByBudget', budgetId],
    queryFn: async () => await api.budgetNote.getByBudget(budgetId),
  })
}

export default useGetNotes
