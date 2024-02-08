import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/APIContext.hooks"

// types
import Budget from "@/models/Budget"

export const useLoadCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: () => {
      // TODO: get currencies
    }
  })
}

export const useSaveBudgetMutation = () => {
  const { api } = useAPI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['budget', 'save'],
    mutationFn: (budget: Budget) => api.budget.save(budget),
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budget', 'findAll'] })
      queryClient.invalidateQueries({ queryKey: ['budget', 'find', budget.id] })
    }
  })
}
