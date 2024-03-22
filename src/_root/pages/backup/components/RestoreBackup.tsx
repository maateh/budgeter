// components
import RestoreBackupForm from "@/components/form/backup/RestoreBackupForm"

const RestoreBackup = () => {
  return (
    <div className="h-fit px-6 py-5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        <span className="text-destructive overline">Restore</span> Your Backup
      </h2>

      <div className="mt-4 flex flex-col justify-center gap-y-2.5">
        <RestoreBackupForm />
      </div>
    </div>
  )
}

export default RestoreBackup
