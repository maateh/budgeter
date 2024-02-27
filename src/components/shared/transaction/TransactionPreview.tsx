import { formatDistance } from "date-fns"

// icons
import { BadgeCheck, BadgeInfo, XSquare } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// components
import TransactionDetailsPopover from "@/components/shared/transaction/TransactionDetailsPopover"
import ConfirmationDialog from "@/components/ui/custom/ConfirmationDialog"
import TransactionBadge from "@/components/ui/custom/TransactionBadge"

// hooks
import { useUpdateTransactionStatus, useDeleteTransaction } from "@/lib/react-query/mutations"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

// TODO: this component should be reworked
const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  const { mutateAsync: updateTransactionStatus } = useUpdateTransactionStatus(transaction.id)
  const { mutateAsync: deleteTransaction } = useDeleteTransaction(transaction.id)

  const handleChangeStatus = async () => {
    try {
      await updateTransactionStatus({
        id: transaction.id,
        processed: !transaction.processed
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id)
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
        {/* TODO: this component should be reworked */}
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
          <p className="mb-1 text-md font-heading border-b">{transaction.name}</p>
          <p className="text-xs font-heading font-medium leading-3 tracking-wider">{budget.name}</p>
          <p className="text-xs italic">
            {formatDistance(
              transaction.createdAt, Date.now(), {
                addSuffix: true
              }
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-x-1 items-center">
        <TransactionBadge transaction={transaction} currency={budget.balance.currency}  />

        <div className="flex items-center">
          <ConfirmationDialog
            title={`Delete "${transaction.name}" Transaction`}
            message="Do you really want to delete this transaction? This action cannot be undone."
            variant="confirm-negative"
            confirm={handleDelete}
          >
            <Button variant="ghost" size="icon-sm">
              <XSquare size={16} />
            </Button>
          </ConfirmationDialog>

          {!transaction.processed && (
            <ConfirmationDialog
              title={`Confirm "${transaction.name}" transaction crediting`}
              message="Has the transaction been credited? You can always withdraw this action."
              variant="confirm-positive"
              confirm={handleChangeStatus}
            >
              <Button variant="ghost" size="icon-sm" className="-ml-1">
                <BadgeCheck size={22} />
              </Button>
            </ConfirmationDialog>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionPreview
