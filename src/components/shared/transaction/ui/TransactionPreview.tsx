import { formatDistance } from "date-fns"

// components
import TransactionStatusToggle from "@/components/shared/transaction/ui/TransactionStatusToggle"
import PaymentBadge from "@/components/shared/payment/ui/PaymentBadge"
import BudgetMarker from "@/components/shared/budget/ui/BudgetMarker"

// types
import { Budget, Transaction } from "@/services/api/types"

// utils
import { isNeutral } from "@/components/shared/payment/utils"
import { cn } from "@/lib/utils"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
} & React.HTMLAttributes<HTMLDivElement>

const TransactionPreview = ({ transaction, budget, className, ...props }: TransactionPreviewProps) => {
  return (
    <div
      className={cn("w-full pl-2.5 pr-3.5 py-1.5 flex justify-between items-center gap-x-1.5 rounded-3xl bg-secondary/90 hover:opacity-95 hover:cursor-pointer", className)}
      {...props}
    >
      <div className="flex items-center gap-x-1">
        <TransactionStatusToggle
          iconProps={{ size: 20, strokeWidth: 2.5 }}
          transaction={transaction}
        />

        <div className="grid">
          <p className="text-md font-heading font-medium truncate">{transaction.name}</p>
          <p className="text-xs max-sm:truncate sm:text-ellipsis">
            {formatDistance(
              transaction.updatedAt, Date.now(), {
                addSuffix: true
              }
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-x-1.5 justify-between items-center">
        <PaymentBadge className="bg-primary"
          payment={transaction.payment}
          processed={transaction.payment.processed}
          currency={budget.balance.currency}
          isNeutral={isNeutral(transaction.type, transaction.payment.processed)}
          showProgress
          transaction={transaction}
          budgetName={budget.name}
        />

        <BudgetMarker
          budget={budget}
          showTooltip
        />
      </div>
    </div>
  )
}

export default TransactionPreview
