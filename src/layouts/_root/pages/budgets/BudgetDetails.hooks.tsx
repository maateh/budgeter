import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import Budget from "@/models/Budget"

export const useLoadBudgetQuery = () => {
  const { api } = useAPI()
  const { id } = useParams()
  if (!id) throw new Error('Budget ID not defined!')

  return useQuery({
    queryKey: ['budget', 'find', id],
    queryFn: () => api.budget.find(id)
  })
}

export const useDeleteBudgetMutation = () => {
  const { api } = useAPI()
  const { id } = useParams()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget', 'delete', id],
    mutationFn: async (budget: Budget) => {
      await api.transaction.bulkDelete(Object.keys(budget.transactions))
      return await api.budget.delete(budget.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', 'findAll'] })
    }
  })
}
