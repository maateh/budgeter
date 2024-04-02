import { formatDistance } from "date-fns"

// icons
import { BadgeInfo } from "lucide-react"

// shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import TransactionStatusToggle from "@/components/shared/transaction/custom/TransactionStatusToggle"
import PaymentBadge, { isNeutral } from "@/components/shared/transaction/custom/PaymentBadge"
import PaymentProgress from "@/components/shared/transaction/PaymentProgress"
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
        <Popover>
          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
            <PaymentBadge
              payment={transaction.payment}
              processed={transaction.processed}
              currency={budget.balance.currency}
              isNeutral={isNeutral(transaction.type, transaction.processed)}
            />
          </PopoverTrigger>
          <PopoverContent onClick={(e) => e.stopPropagation()}>
            {transaction.type === 'borrow' ? (
              <PaymentProgress transaction={{ ...transaction, budget }} />
            ) : (
              <div className="icon-wrapper">
                <BadgeInfo size={18} />
                <span className="text-sm">
                  {transaction.processed
                    ? 'Payment has already been processed.'
                    : "Payment hasn't been processed yet."}
                </span>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <BudgetMarker
          budget={budget}
          showTooltip
        />
      </div>
    </div>
  )
}

export default TransactionPreview
