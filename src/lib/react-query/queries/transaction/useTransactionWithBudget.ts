import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useTransactionWithBudget = (transactionId: string) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['transaction', { id: transactionId }, 'withBudget'],
    queryFn: async () => await api.transaction.getByIdWithBudget(transactionId)
  })
}

export default useTransactionWithBudget
