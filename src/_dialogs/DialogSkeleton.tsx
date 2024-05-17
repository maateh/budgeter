import { useNavigate } from "react-router-dom"

// shadcn
import { DialogOverlay } from "@/components/ui/dialog"
import { PageLoader } from "@/components/ui/skeleton"

const DialogSkeleton = () => {
  const navigate = useNavigate()

  return (
    <DialogOverlay onClick={() => navigate(-1)}>
      <PageLoader />
    </DialogOverlay>
  )
}

export default DialogSkeleton
