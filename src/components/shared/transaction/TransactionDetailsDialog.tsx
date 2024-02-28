// shadcn
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionDetailsDialogProps = React.PropsWithChildren & {
  transaction: Transaction
  budget: Budget
}

const TransactionDetailsDialog = ({ transaction, budget, children }: TransactionDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        {/* TODO: add content */}
      </DialogContent>
    </Dialog>
  )
}

export default TransactionDetailsDialog
