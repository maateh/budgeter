import { useMutation, useQueryClient } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

const useRestoreBackup = () => {
  const queryClient = useQueryClient()
  const { api } = useAPI()

  return useMutation({
    mutationKey: ['restoreBackup'],
    mutationFn: (backupFile: RestoreBackupFieldValues) => api.backup.restore(backupFile),
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })
}

export default useRestoreBackup
