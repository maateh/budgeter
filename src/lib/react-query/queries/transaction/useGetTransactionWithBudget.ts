import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useGetTransactionWithBudget = (transactionId: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['getTransactionWithBudget', transactionId],
    queryFn: async () => await api.transaction.getTransactionWithBudget(transactionId)
  })
}

export default useGetTransactionWithBudget
