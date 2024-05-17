import { useNavigate } from "react-router-dom"

// shadcn
import { AlertDialogOverlay } from '@/components/ui/alert-dialog'
import { PageLoader } from '@/components/ui/skeleton'

const AlertSkeleton = () => {
  const navigate = useNavigate()

  return (
    <AlertDialogOverlay onClick={() => navigate(-1)}>
      <PageLoader />
    </AlertDialogOverlay>
  )
}

export default AlertSkeleton
