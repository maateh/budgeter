import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { TransferMoneyFieldValues } from "@/components/form/transfer-money/types"

const useTransferMoney = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: [],
    mutationFn: async (data: TransferMoneyFieldValues) => await api.transaction.transferMoney(data),
    onSuccess: ({ rootTransaction, targetTransaction }) => {
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', rootTransaction.budgetId] })
      queryClient.invalidateQueries({ queryKey: ['budgetTransactions', targetTransaction.budgetId] })
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactionsWithBudgets', { type: 'default', processed: true }] })

      queryClient.invalidateQueries({ queryKey: ['budget', rootTransaction.budgetId] })
      queryClient.invalidateQueries({ queryKey: ['budget', targetTransaction.budgetId] })
    }
  })
}

export default useTransferMoney
