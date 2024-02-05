import { formatDistance } from "date-fns"

// icons
import { BadgeCheck, XSquare } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetTypeBadge from "@/components/shared/BudgetTypeBadge"
import ConfirmSheet from "@/components/shared/ConfirmSheet"
import TransactionBadge from "@/components/shared/TransactionBadge"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// hooks
import { useDeleteTransactionMutation, useAcceptTransactionMutation } from "./TransactionPreview.hooks"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  const { mutateAsync: deleteTransaction } = useDeleteTransactionMutation(
    transaction.id,
    budget.id
  )
  const { mutateAsync: acceptTransaction } = useAcceptTransactionMutation(transaction.id)

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAccept = async () => {
    transaction.updateStatus('processed', budget)

    try {
      await acceptTransaction({ transaction, budget })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className="pl-5 pr-1.5 py-2 flex justify-between items-center rounded-full"
      style={{
        backgroundColor: budget.theme.background,
        color: budget.theme.foreground
      }}
    >
      <div className="icon-wrapper">
        <BudgetTypeBadge budget={budget} size="icon-sm" iconSize={16} />
        <div className="flex flex-col font-medium">
          <p className="text-md leading-4 font-heading">{transaction.label}</p>
          <p className="text-xs">
            <span className="font-semibold tracking-wider">{budget.name} - </span>
            <span className="italic">
              {formatDistance(
                transaction.date.crediting || transaction.date.creation, Date.now(), {
                  addSuffix: true
                }
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="flex gap-x-1 items-center">
        <TransactionBadge transaction={transaction} />

        <div className="flex items-center">
          <ConfirmSheet
            title={`Delete "${transaction.label}" Transaction`}
            message="Do you really want to delete this transaction? This action cannot be undone."
            variant="confirm-delete"
            confirm={handleDelete}
          >
            <Button variant="ghost" size="icon-sm">
              <XSquare size={16} />
            </Button>
          </ConfirmSheet>

          {transaction.processing && (
            <ConfirmSheet
              title={`Confirm "${transaction.label}" transaction crediting`}
              message="Has the transaction been credited? You can always withdraw this action."
              variant="confirm-accept"
              confirm={handleAccept}
            >
              <Button variant="ghost" size="icon-sm" className="-ml-1">
                <BadgeCheck size={22} />
              </Button>
            </ConfirmSheet>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionPreview
