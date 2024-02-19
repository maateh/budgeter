import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// models
import Transaction from "@/models/Transaction"

const useLoadTransactionsQuery = (status?: Transaction['status']) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => await api.transaction.findAll(status)
  })
}

export default useLoadTransactionsQuery
