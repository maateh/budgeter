// icons
import { Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"

// components
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import TransactionStatusToggle from "@/components/shared/transaction/custom/TransactionStatusToggle"

// hooks
import { useDialog } from "@/hooks"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionDetailsFooterProps = {
  transaction: Transaction & { budget: Budget }
}

const TransactionDetailsFooter = ({ transaction }: TransactionDetailsFooterProps) => {
  const { openDialog } = useDialog()

  return (
    <DialogFooter className="block">
      <div className="flex flex-wrap flex-row justify-between items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-x-2.5">
          <TransactionStatusToggle transaction={transaction} />
          <PaymentBadge
            transaction={transaction}
            currency={transaction.budget.balance.currency}
            size="lg"
          />
        </div>

        <Button className="ml-auto flex items-center gap-x-1.5"
          variant="destructive"
          size="sm"
          onClick={() => openDialog(`/transactions/delete/${transaction.id}`, { replace: true })}
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </Button>
      </div>
    </DialogFooter>
  )
}

export default TransactionDetailsFooter