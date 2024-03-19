// icons
import { PackageCheck, PackageOpen } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useCreateBackup } from "@/lib/react-query/mutations"

const BackupTable = () => {
  // WIP
  const { data: url, isPending: isBackupPending, mutateAsync: createBackup } = useCreateBackup()

  const handleCreate = async () => {
    try {
      await createBackup()
    } catch (err) {
      console.error(err)
    }
  }

  // TODO: budget selector (table) with actions in a footer
  return (
    <div>
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
    </div>
  )
}

export default BackupTable
