// icons
import { XSquare } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetTypeBadge from "@/components/shared/BudgetTypeBadge"
import ConfirmSheet from "@/components/shared/ConfirmSheet"

// models
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// hooks
import { useDeleteTransactionMutation } from "./TransactionPreview.hooks"
import TransactionBadge from "./TransactionBadge"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  const { mutateAsync: deleteTransaction } = useDeleteTransactionMutation(transaction)

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction)
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
          <p className="text-lg leading-4 font-heading">{transaction.label}asd</p>
          <p className="text-xs">
            <span className="font-semibold tracking-wider">{budget.name} - </span>
            {/* TODO: parse date */}
            <span className="italic">
              {transaction.date.getUTCFullYear()}.{transaction.date.getUTCMonth()+1}.{transaction.date.getUTCDate()}
            </span>
          </p>
        </div>
      </div>

      <div className="flex gap-x-1 items-center">
        <TransactionBadge transaction={transaction} />
        
        <ConfirmSheet
          title={`Delete "${transaction.label}" Transaction`}
          message="Do you really want to delete this transaction?"
          confirm={handleDelete}
        >
          <Button variant="ghost" size="icon-sm">
            <XSquare size={16} />
          </Button>
        </ConfirmSheet>
      </div>
    </div>
  )
}

export default TransactionPreview
