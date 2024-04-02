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
      // budget
      queryClient.invalidateQueries({ queryKey: ['budget', { id: rootTransaction.budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['budget', { id: targetTransaction.budgetId }] })

      // transaction
      queryClient.invalidateQueries({ queryKey: ['transactions', { type: 'transfer' }] })

      // payment
      queryClient.invalidateQueries({ queryKey: ['payments', { budgetId: rootTransaction.budgetId }] })
      queryClient.invalidateQueries({ queryKey: ['payments', { budgetId: targetTransaction.budgetId }] })
    }
  })
}

export default useTransferMoney
