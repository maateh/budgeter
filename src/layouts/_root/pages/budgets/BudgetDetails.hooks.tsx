import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// api
import API from "@/api"

// types
import Budget from "@/models/Budget"

export const useLoadBudgetQuery = () => {
  const { id } = useParams()
  if (!id) throw new Error('Budget ID not defined!')

  return useQuery({
    queryKey: ['budget', 'find', id],
    queryFn: () => API.budget.find(id)
  })
}

export const useDeleteBudgetMutation = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget', 'delete', id],
    mutationFn: async (budget: Budget) => {
      await API.transaction.bulkDelete(Object.keys(budget.transactions))
      return await API.budget.delete(budget.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['budget', id]
      })
      queryClient.invalidateQueries({
        queryKey: ['budget', id]
      })
    }
  })
}
