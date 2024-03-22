// shadcn
import { Separator } from "@/components/ui/separator"

// components
import RestoreBackup from "./components/RestoreBackup"
import CreateBackup from "./components/CreateBackup"

const Backup = () => {
  return (
    <div className="page-wrapper">
      <h1>
        Backup <span className="text-teal-600 dark:text-teal-500">Manager</span>
      </h1>

      <Separator className="my-6" />

      <div className="flex flex-col justify-between gap-x-8 gap-y-6 md:flex-row">
        <section className="min-w-56 md:w-2/5 md:min-w-72 md:max-w-lg">
          <RestoreBackup />
        </section>

        <section className="flex-1 section-wrapper md:w-3/5">
          <CreateBackup />
        </section>
      </div>
    </div>
  )
}

export default Backup
