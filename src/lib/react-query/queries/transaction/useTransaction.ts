import { UseQueryOptions, useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { Transaction } from "@/services/api/types"

const useTransactionWithBudget = (transactionId: string, options?: Omit<UseQueryOptions<Transaction>, 'queryKey' | 'queryFn'>) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['transaction', { id: transactionId }],
    queryFn: async () => await api.transaction.getById(transactionId),
    ...options
  })
}

export default useTransactionWithBudget
