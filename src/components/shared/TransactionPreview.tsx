import { formatDistance } from "date-fns"

// icons
import { BadgeCheck, BadgeInfo, XSquare } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// components
import TransactionDetailsPopover from "@/components/shared/TransactionDetailsPopover"
import ConfirmSheet from "@/components/shared/ConfirmSheet"
import TransactionBadge from "@/components/ui/custom/TransactionBadge"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// hooks
import { useDeleteTransactionMutation, useChangeTransactionStatusMutation } from "./TransactionPreview.hooks"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  const { mutateAsync: deleteTransaction } = useDeleteTransactionMutation(
    transaction.id,
    budget.id
  )
  const { mutateAsync: changeTransactionStatus } = useChangeTransactionStatusMutation(transaction.id)

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChangeStatus = async () => {
    transaction.updateStatus(
      transaction.status === 'processing' ? 'processed' : 'processing',
      budget
    )

    try {
      await changeTransactionStatus({ transaction, budget })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className="pl-5 pr-1.5 py-2 flex justify-between items-center gap-x-1.5 rounded-full hover:opacity-95"
      style={{
        backgroundColor: budget.theme.background,
        color: budget.theme.foreground
      }}
    >
      <div className="icon-wrapper">
        <TransactionDetailsPopover
          transaction={transaction}
          budget={budget}
          handleChangeStatus={handleChangeStatus}
          handleDelete={handleDelete}
        >
          <Badge size="icon-sm">
            <BadgeInfo size={20} />
          </Badge>
        </TransactionDetailsPopover>

        <div className="flex flex-col font-medium truncate">
          <p className="mb-1 text-md font-heading border-b">{transaction.label}</p>
          <p className="text-xs font-heading font-medium leading-3 tracking-wider">{budget.name}</p>
          <p className="text-xs italic">
            {formatDistance(
              transaction.date.credited || transaction.date.created, Date.now(), {
                addSuffix: true
              }
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-x-1 items-center">
        <TransactionBadge transaction={transaction} currency={budget.currency}  />

        <div className="flex items-center">
          <ConfirmSheet
            title={`Delete "${transaction.label}" Transaction`}
            message="Do you really want to delete this transaction? This action cannot be undone."
            variant="confirm-negative"
            confirm={handleDelete}
          >
            <Button variant="ghost" size="icon-sm">
              <XSquare size={16} />
            </Button>
          </ConfirmSheet>

          {transaction.status === 'processing' && (
            <ConfirmSheet
              title={`Confirm "${transaction.label}" transaction crediting`}
              message="Has the transaction been credited? You can always withdraw this action."
              variant="confirm-positive"
              confirm={handleChangeStatus}
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
