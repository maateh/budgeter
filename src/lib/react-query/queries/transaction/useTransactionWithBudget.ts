import { UUID } from "crypto"
import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useTransactionWithBudget = (transactionId: UUID) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['transactionWithBudget', transactionId],
    queryFn: async () => await api.transaction.getByIdWithBudget(transactionId)
  })
}

export default useTransactionWithBudget
