import { Outlet } from "react-router-dom"

// shadcn
import { AlertDialog } from "@/components/ui/alert-dialog"

const AlertLayout = () => {
  return (
    <AlertDialog defaultOpen>
      <Outlet />
    </AlertDialog>
  )
}

export { AlertLayout }
