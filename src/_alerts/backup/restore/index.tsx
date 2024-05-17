import { Location, useLocation, useNavigate } from "react-router-dom"

// icons
import { AlertTriangle, ArchiveRestore } from "lucide-react"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

// components
import BackupInfo from "@/components/shared/backup/BackupInfo"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useRestoreBackup } from "@/lib/react-query/mutations"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

// utils
import { format } from "date-fns"

type RestoreState = {
  backup: RestoreBackupFieldValues
}

const RestoreBackup = () => {
  const navigate = useNavigate()
  const { state: { backup }} = useLocation() as Location<RestoreState>

  const { toast } = useToast()

  const { mutateAsync: restoreBackup, isPending } = useRestoreBackup()

  const handleRestore = async () => {
    try {
      await restoreBackup(backup)

      toast({
        variant: 'accent',
        title: 'Restored: Backup',
        description: (
          <>
            <p>Backup has been successfully restored!</p>
            <p className="text-xs font-heading font-semibold">
              {format(backup.fileContent.backup_date, 'yyyy. MM. dd. - HH:mm')}
            </p>
          </>
        )
      })
      navigate('/')
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong.',
        description: 'Please try the restore again or try uploading another backup.',
        action: (
          <Button className="icon-wrapper"
            size="sm"
            onClick={handleRestore}
            disabled={isPending}
          >
            <ArchiveRestore size={16} strokeWidth={2.5} />
            Try again
          </Button>
        )
      })
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
