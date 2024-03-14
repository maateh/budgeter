import { Outlet, useNavigate } from "react-router-dom"

// shadcn
import { Dialog, DialogContent } from "@/components/ui/dialog"

const DialogLayout = () => {
  const navigate = useNavigate()

  return (
    <Dialog onOpenChange={() => navigate(-1)} defaultOpen>
      <DialogContent>
        <Outlet />
      </DialogContent>
    </Dialog>
  )
}

export default DialogLayout
