import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

const useLoadTransactionsQuery = (status?: Transaction['status']) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['transactions', status],
    queryFn: async () => await api.transaction.getAll(status)
  })
}

export default useLoadTransactionsQuery
