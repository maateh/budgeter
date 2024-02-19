import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// models
import Transaction from "@/models/Transaction"
import Budget from "@/models/Budget"

const useSwitchTransactionStatusMutation = (transactionId: string) => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['updateTransaction', transactionId, 'status'],
    mutationFn: async ({ transaction, budget }: {
      transaction: Transaction
      budget: Budget
    }) => {
      transaction.updateStatus(
        transaction.status === 'processing' ? 'processed' : 'processing',
        budget
      )

      await api.budget.save(budget)
      return await api.transaction.save(transaction)
    },
    onSuccess: ({ id, budgetId }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', id] })

      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] })
    }
  })
}

export default useSwitchTransactionStatusMutation
