import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNote } from "@/services/api/types"

const useGetNotesbyStatus = (budgetId: UUID, status: BudgetNote['status']) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['getNotesByStatus', budgetId, status],
    queryFn: async () => await api.budgetNote.getByStatus(budgetId, status),
  })
}

export default useGetNotesbyStatus
