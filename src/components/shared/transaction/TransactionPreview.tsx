import { formatDistance } from "date-fns"

// components
import TransactionStatusToggle from "@/components/shared/transaction/custom/TransactionStatusToggle"
import PaymentBadge from "@/components/shared/transaction/custom/PaymentBadge"
import BudgetMarker from "@/components/shared/budget/custom/BudgetMarker"

// hooks
import { useDialog } from "@/hooks"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  const { openDialog } = useDialog()

  return (
    <div
      className="pl-2.5 pr-3.5 py-1.5 flex justify-between items-center gap-x-1.5 rounded-3xl bg-secondary/90 hover:opacity-95 hover:cursor-pointer"
      onClick={() => openDialog(`/transactions/details/${transaction.id}`)}
    >
      <div className="flex items-center gap-x-1">
        <TransactionStatusToggle transaction={transaction} />
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
        <PaymentBadge
          transaction={{
            ...transaction,
            payment: transaction.subpayments?.length ? {
              ...transaction.payment,
              amount: transaction.subpayments.reduce((total, payment) => {
                return total - (payment.type === '+' ? payment.amount : -payment.amount)
              }, transaction.payment.amount)
            } : transaction.payment
          }}
          currency={budget.balance.currency}
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
