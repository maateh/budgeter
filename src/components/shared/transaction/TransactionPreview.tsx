import { formatDistance } from "date-fns"

// components
import TransactionStatusToggle from "@/components/shared/transaction/custom/TransactionStatusToggle"
import PaymentBadge, { isNeutral } from "@/components/shared/payment/custom/PaymentBadge"
import BudgetMarker from "@/components/shared/budget/custom/BudgetMarker"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
  onClick?: () => void
}

const TransactionPreview = ({ transaction, budget, onClick }: TransactionPreviewProps) => {
  return (
    <div
      className="w-full pl-2.5 pr-3.5 py-1.5 flex justify-between items-center gap-x-1.5 rounded-3xl bg-secondary/90 hover:opacity-95 hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-1">
        <TransactionStatusToggle
          transaction={transaction}
          budget={budget}
          iconProps={{ size: 20, strokeWidth: 2.5 }}
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
        <PaymentBadge
          payment={transaction.payment}
          processed={transaction.processed}
          currency={budget.balance.currency}
          isNeutral={isNeutral(transaction.type, transaction.processed)}
          transaction={transaction}
          budget={budget}
          showProgress
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
