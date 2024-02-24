import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

const useLoadTransactionsQuery = (type: Transaction['type'], status?: Transaction['status']) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['transactions', type, status],
    queryFn: async () => await api.transaction.getAll(status)
  })
}

export default useLoadTransactionsQuery
