import { Outlet, useNavigate } from "react-router-dom"

// shadcn
import { Dialog } from "@/components/ui/dialog"

const DialogLayout = () => {
  const navigate = useNavigate()

  return (
    <Dialog onOpenChange={() => navigate(-1)} defaultOpen>
      <Outlet />
    </Dialog>
  )
}

export { DialogLayout }
export { default as DialogSkeleton } from './DialogSkeleton'
