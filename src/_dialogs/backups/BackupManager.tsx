// icons
import { History } from "lucide-react"

// shadcn
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const BackupManager = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl indent-border icon-wrapper">
          <History size={20} />
          Manage <span className="text-destructive overline">Backups</span>
        </DialogTitle>
      </DialogHeader>

      <Separator className="w-11/12 mx-auto" />
    </DialogContent>
  )
}

export default BackupManager
