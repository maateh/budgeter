// icons
import { ArchiveRestore, PackageCheck, PackageOpen } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// hooks
import { useCreateBackup } from "@/lib/react-query/mutations"

const BackupManager = () => {
  const { data: url, isPending: isBackupPending, mutateAsync: createBackup } = useCreateBackup()

  const handleCreate = async () => {
    try {
      await createBackup()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl indent-border icon-wrapper">
          Manage <span className="text-destructive overline">Backups</span>
        </DialogTitle>
      </DialogHeader>

      <Separator className="w-11/12 mx-auto" />

      <div className="flex flex-wrap justify-center items-end gap-x-2.5 gap-y-1.5">
        <div className="max-w-sm">
          <Label className="text-md small-caps"
            htmlFor="backup-file"
          >
            Restore Your Backup
          </Label>
          <Input id="backup-file" type="file" />
        </div>

        <Button className="icon-wrapper"
          variant="outline"
        >
          <ArchiveRestore strokeWidth={2.5} />
          Restore
        </Button>
      </div>

      <Separator />

      {/* TODO: add budget selector */}

      <Button className="w-fit icon-wrapper"
        onClick={handleCreate}
      >
        <PackageOpen />
        Create a Backup
      </Button>

      {!isBackupPending ? url && (
        <a className="w-fit px-3.5 py-1.5 rounded-full border-2 icon-wrapper"
          href={url}
          download
        >
          <PackageCheck />
          Your Backup is ready to save
        </a>
      ) : (
        <>Loading...</> // TODO: skeleton
      )}
    </DialogContent>
  )
}

export default BackupManager
