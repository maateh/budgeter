import { UUID } from "crypto"
import { useNavigate, useParams } from "react-router-dom"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

// hooks
import { useGetBudget } from "@/lib/react-query/queries"
import { useDeleteBudget } from "@/lib/react-query/mutations"

const DeleteBudget = () => {
  const { id } = useParams() as { id: UUID }
  const navigate = useNavigate()

  const { data: budget, isLoading } = useGetBudget(id)
  const { mutateAsync: deleteBudget } = useDeleteBudget(id)

  const deleteConfirm = async () => {
    try {
      await deleteBudget(id) 
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AlertDialogContent variant="negative">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete Budget - {!isLoading && budget ? budget.name : <>Loading...</> /*TODO: skeleton*/}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <Separator />

      <AlertDialogDescription className="break-words overflow-clip">
        This action cannot be undone. This will permanently delete this budget and all associated transactions.
      </AlertDialogDescription>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => navigate(-1)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={deleteConfirm}>
          Confirm
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default DeleteBudget
