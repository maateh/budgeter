import { formatDistance } from "date-fns"

// icons
import { BadgeCheck, BadgeInfo, XSquare } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// components
import TransactionDetailsPopover from "@/components/shared/TransactionDetailsPopover"
import ConfirmationDialog from "@/components/shared/ConfirmationDialog"
import TransactionBadge from "@/components/ui/custom/TransactionBadge"

// hooks
import { useChangeTransactionStatusMutation, useDeleteTransactionMutation } from "@/lib/react-query/mutations"

// types
import { Budget, Transaction } from "@/services/api/types"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  const { mutateAsync: changeTransactionStatus } = useChangeTransactionStatusMutation(transaction.id)
  const { mutateAsync: deleteTransaction } = useDeleteTransactionMutation(
    transaction.id,
    budget.id
  )

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChangeStatus = async () => {
    try {
      await changeTransactionStatus({
        id: transaction.id,
        status: transaction.status === 'processed' ? 'processing' : 'processed'
      })
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
          <ConfirmationDialog
            title={`Delete "${transaction.label}" Transaction`}
            message="Do you really want to delete this transaction? This action cannot be undone."
            variant="confirm-negative"
            confirm={handleDelete}
          >
            <Button variant="ghost" size="icon-sm">
              <XSquare size={16} />
            </Button>
          </ConfirmationDialog>

          {transaction.status === 'processing' && (
            <ConfirmationDialog
              title={`Confirm "${transaction.label}" transaction crediting`}
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
