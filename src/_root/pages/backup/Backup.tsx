// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BackupSidebar from "./components/BackupSidebar"
import BackupTable from "./components/BackupTable"

const Backup = () => {
  return (
    <div className="page-wrapper">
      <h1>
        Backup <span className="text-destructive">Manager</span>
      </h1>

      <Separator className="my-6" />

      <div className="flex flex-col justify-between gap-x-8 gap-y-6 md:flex-row">
        <section className="min-w-56 md:w-2/5 md:min-w-72 md:max-w-lg">
          <BackupSidebar />
        </section>

        <section className="flex-1 section-wrapper md:w-3/5">
          <BackupTable />
        </section>
      </div>
    </div>
  )
}

export default Backup
