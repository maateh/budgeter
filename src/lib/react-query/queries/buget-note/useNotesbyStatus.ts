import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { BudgetNote } from "@/services/api/types"

const useNotesbyStatus = (budgetId: UUID, status: BudgetNote['status']) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['notesByStatus', budgetId, status],
    queryFn: async () => await api.budgetNote.getByStatus(budgetId, status),
  })
}

export default useNotesbyStatus
