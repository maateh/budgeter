import { useMutation } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useBackup = () => {
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['createBackup'],
    mutationFn: async () => api.backup.create()
  })
}

export default useBackup
