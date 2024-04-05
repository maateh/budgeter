import { SubmitHandler } from "react-hook-form"

// hooks
import { useDialog } from "@/hooks"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

const useRestoreBackupSubmit = () => {
  const { openDialog } = useDialog()

  const onSubmit: SubmitHandler<RestoreBackupFieldValues> = (values) => {
    openDialog('/backup/restore', {}, { backup: values })
  }

  return { onSubmit, isPending: false }
}

export default useRestoreBackupSubmit
