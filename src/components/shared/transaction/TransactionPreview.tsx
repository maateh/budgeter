import { formatDistance } from "date-fns"

// components
import TransactionDetailsDialog from "@/components/shared/transaction/TransactionDetailsDialog"
import TransactionStatusSwitch from "@/components/shared/transaction/TransactionStatusSwitch"
import PaymentBadge from "@/components/shared/transaction/PaymentBadge"
import BudgetMarker from "@/components/shared/budget/BudgetMarker"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  return (
    <TransactionDetailsDialog transaction={transaction} budget={budget}>
      <div className="pl-2.5 pr-3.5 py-1.5 flex justify-between items-center gap-x-1.5 rounded-3xl bg-secondary/90 hover:opacity-95 hover:cursor-pointer">
        <div className="flex items-center gap-x-1">
          <TransactionStatusSwitch transaction={transaction} />

          <div className="grid">
            <p className="text-md font-heading font-medium truncate">{transaction.name}</p>
            <p className="text-xs max-sm:truncate sm:text-ellipsis">
              {formatDistance(
                transaction.processedAt || transaction.createdAt, Date.now(), {
                  addSuffix: true
                }
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-x-2 justify-between items-center">
          <PaymentBadge transaction={transaction} currency={budget.balance.currency}  />
          <BudgetMarker budget={budget} />
        </div>
      </div>
    </TransactionDetailsDialog>
  )
}

export default TransactionPreview
