import { UUID } from "crypto"
import { useParams } from "react-router-dom"

// shadcn
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import TransactionForm from "@/components/form/transaction/TransactionForm"

const CreateTransaction = () => {
  const { budgetId } = useParams() as { budgetId?: UUID }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-3xl">
          Add <span className="text-accent overline">Transaction</span>
        </DialogTitle>
      </DialogHeader>

      <Separator />

      <TransactionForm budgetId={budgetId} />
    </DialogContent>
  )
}

export default CreateTransaction
