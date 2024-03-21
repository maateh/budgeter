import { useNavigate } from "react-router-dom"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useRestoreBackup } from "@/lib/react-query/mutations"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

const useRestoreBackupSubmit = (form: UseFormReturn<RestoreBackupFieldValues>) => {
  const navigate = useNavigate()

  const { mutateAsync: restoreBackup, isPending } = useRestoreBackup()

  const onSubmit: SubmitHandler<RestoreBackupFieldValues> = async (values) => {

    try {
      await restoreBackup(values)

      form.reset()
      navigate('/')

      // TODO: toast
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useRestoreBackupSubmit
