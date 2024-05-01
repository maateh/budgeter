import { useState } from "react"
import { Location, useLocation, useNavigate, useParams } from "react-router-dom"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useDeleteTransaction } from "@/lib/react-query/mutations"

// types
import { Transaction } from "@/services/api/types"

type DeleteTransactionState = {
  transaction: Transaction
}

const DeleteTransaction = () => {
  const { id } = useParams() as { id: string }
  const { state: { transaction }} = useLocation() as Location<DeleteTransactionState>
  const navigate = useNavigate()

  const [removeRelated, setRemoveRelated] = useState(false)

  const { toast } = useToast()

  const { mutateAsync: deleteTransaction, isPending: isDeletePending } = useDeleteTransaction(id)

  const deleteConfirm = async () => {
    try {
      await deleteTransaction({ id, removeRelated })

      navigate(-1)
      toast({
        variant: 'destructive',
        title: `Deleted: Transaction - ${transaction.name}`,
        description: 'Transaction has been successfully deleted.'
      })
    } catch (err) {
      console.error(err)
      
      toast({
        variant: 'destructive',
        title: `Oops! Failed to delete transaction.`,
        description: 'Please try again.'
      })
    }
  }

  return (
    <AlertDialogContent variant="negative">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete Transaction - {transaction.name}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <Separator />

      <AlertDialogDescription className="break-words overflow-clip">
        This action cannot be undone. This will permanently delete this transaction and withdraw the payment within the budget if it has already been processed.
      </AlertDialogDescription>

      {transaction.relatedIds.length ? (
        <div className="icon-wrapper">
          <Checkbox className="size-5 border-2 data-[state=checked]:border-accent"
            id="removeRelated"
            checked={removeRelated}
            onCheckedChange={() => setRemoveRelated((removeRelated) => !removeRelated)}
          />
          <label className="text-accent font-semibold capitalize small-caps"
            htmlFor="removeRelated"
          >
            Remove related transactions
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
