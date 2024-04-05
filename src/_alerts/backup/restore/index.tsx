import { Location, useLocation, useNavigate } from "react-router-dom"

// icons
import { AlertTriangle, ArchiveRestore } from "lucide-react"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog"

// hooks
import { useRestoreBackup } from "@/lib/react-query/mutations"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"
import BackupInfo from "@/components/shared/backup/BackupInfo"

type RestoreState = {
  backup: RestoreBackupFieldValues
}

const RestoreBackup = () => {
  const navigate = useNavigate()
  const { state: { backup }} = useLocation() as Location<RestoreState>

  const { mutateAsync: restoreBackup, isPending } = useRestoreBackup()

  const handleRestore = async () => {
    try {
      await restoreBackup(backup)

      navigate('/')
      // TODO: toast
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AlertDialogContent variant="negative">
      <AlertDialogHeader className="text-lg font-heading font-semibold">
        Do you want to restore the backup?
      </AlertDialogHeader>

      <AlertDialogDescription className="icon-wrapper">
        <AlertTriangle className="text-destructive" size={20} />
        <span>This action cannot be undone.</span>
      </AlertDialogDescription>

      <BackupInfo {...backup.fileContent} />

      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => navigate(-1)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction className="icon-wrapper"
          onClick={handleRestore}
          disabled={isPending}
        >
          <ArchiveRestore strokeWidth={2.5} />
          Confirm
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default RestoreBackup
