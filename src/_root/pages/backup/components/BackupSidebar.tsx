// components
import RestoreBackupForm from "@/components/form/backup/RestoreBackupForm"

const BackupSidebar = () => {
  // WIP
  return (
    <div className="h-fit px-6 py-5 bg-secondary rounded-[2rem]">
      <h2>
        <span className="overline">Restore</span> Your Backup
      </h2>

      <div className="mt-4 flex flex-col justify-center gap-y-2.5">
        <RestoreBackupForm />
      </div>
    </div>
  )
}

export default BackupSidebar
