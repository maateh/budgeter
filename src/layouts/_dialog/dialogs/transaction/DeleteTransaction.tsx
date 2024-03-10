import { UUID } from "crypto"
import { useNavigate, useParams } from "react-router-dom"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

// hooks
import { useGetTransactionWithBudget } from "@/lib/react-query/queries"
import { useDeleteTransaction } from "@/lib/react-query/mutations"

const DeleteTransaction = () => {
  const { id } = useParams() as { id: UUID }
  const navigate = useNavigate()

  const { data: transaction, isLoading } = useGetTransactionWithBudget(id)
  const { mutateAsync: deleteTransaction } = useDeleteTransaction(id)

  const deleteConfirm = async () => {
    try {
      await deleteTransaction({ id })
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AlertDialogContent variant="negative">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete Transaction - {!isLoading && transaction ? transaction.name : <>Loading...</> /*TODO: skeleton*/}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <Separator />

      <AlertDialogDescription className="break-words overflow-clip">
        This action cannot be undone. This will permanently delete this transaction and withdraw the payment within the budget if it has already been processed.
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

export default DeleteTransaction