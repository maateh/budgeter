import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// hooks
import { useTransactionWithBudget } from "@/lib/react-query/queries"
import { useDeleteTransaction } from "@/lib/react-query/mutations"

const DeleteTransaction = () => {
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }

  const [removeRelated, setRemoveRelated] = useState(false)

  const { data: transaction, isLoading } = useTransactionWithBudget(id)
  const { mutateAsync: deleteTransaction, isPending: isDeletePending } = useDeleteTransaction(id)

  const deleteConfirm = async () => {
    try {
      await deleteTransaction({ id, removeRelated })

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

      {transaction?.relatedIds.length ? (
        <div className="icon-wrapper">
          <Checkbox className="size-5 border-2 data-[state=checked]:border-accent" id="removeRelated"
            checked={removeRelated}
            onCheckedChange={() => setRemoveRelated((removeRelated) => !removeRelated)}
          />
          <label className="text-accent font-semibold capitalize small-caps"
            htmlFor="removeRelated"
          >
            Delete related transactions
          </label>
        </div>
      ) : <></>}

      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => navigate(-1)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={deleteConfirm}
          disabled={isDeletePending}
        >
          Confirm
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default DeleteTransaction
