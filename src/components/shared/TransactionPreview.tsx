// icons
import { Minus, Plus } from "lucide-react"

// models
import Budget from "@/models/Budget"
import Transaction, { TransactionType } from "@/models/Transaction"
import BudgetTypeBadge from "./BudgetTypeBadge"

type TransactionPreviewProps = {
  transaction: Transaction
  budget: Budget
}

const TransactionPreview = ({ transaction, budget }: TransactionPreviewProps) => {
  return (
    <div
      className="px-5 py-2 flex justify-between items-center rounded-full"
      style={{
        backgroundColor: budget.theme.background,
        color: budget.theme.foreground
      }}
    >
      <div className="icon-wrapper">
        <BudgetTypeBadge budget={budget} size="icon-sm" iconSize={16} />
        <div className="flex flex-col font-medium">
          <p className="text-lg leading-4 font-heading">{transaction.label}</p>
          <p className="text-xs leading-4 italic">{budget.name}</p>
        </div>
      </div>

      <div className={`
        px-2 py-0.5 font-heading text-xl font-bold flex items-center gap-x-1.5 rounded-full border-2 border-foreground/30
        ${transaction.type === TransactionType.PLUS ? 'bg-green-500/90' : 'bg-red-500/90'}
      `}>
        {transaction.type === TransactionType.PLUS ? (
          <Plus size={16} strokeWidth={8} />
        ) : (
          <Minus size={16} strokeWidth={8} />
        )}
        <span>${transaction.amount}</span>
      </div>
    </div>
  )
}

export default TransactionPreview
