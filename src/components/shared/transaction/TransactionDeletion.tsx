import { useNavigate } from "react-router-dom"

// icons
import { Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import ConfirmationDialog from "@/components/ui/custom/ConfirmationDialog"

// hooks
import { useDeleteTransaction } from "@/lib/react-query/mutations"

// types
import { Transaction } from "@/services/api/types"

type TransactionDeletionProps = {
  transaction: Transaction
}

const TransactionDeletion = ({ transaction }: TransactionDeletionProps) => {
  const navigate = useNavigate()

  const { mutateAsync: deleteTransaction } = useDeleteTransaction(transaction.id)

  const deleteConfirm = async () => {
    try {
      await deleteTransaction({ id: transaction.id })
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ConfirmationDialog
      title={`Delete Transaction - ${transaction.name}`}
      description="This action cannot be undone. This will permanently delete this transaction and withdraw the payment within the budget if it has already been processed."
      variant="negative"
      action={deleteConfirm}
    >
      <Button
        variant="destructive"
        size="sm"
        className="ml-auto flex items-center gap-x-1.5"
      >
        <Trash2 size={18} />
        <span>Delete</span>
      </Button>
    </ConfirmationDialog>
  )
}

export default TransactionDeletion
