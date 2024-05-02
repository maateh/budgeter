import { useMutation } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useCreateBackup = () => {
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createBackup'],
    mutationFn: async ({ complete, budgetIds }: {
      complete: boolean
      budgetIds: string[]
    }) => await api.backup.create(complete, budgetIds)
  })
}

export default useCreateBackup
