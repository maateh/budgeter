// context
import useStorage from "@/layouts/_root/context/useStorage"

// models
import Transaction, { TransactionType } from "@/models/Transaction"
import { Landmark, Minus, Plus } from "lucide-react"

type TransactionPreviewProps = {
  transaction: Transaction
}

const TransactionPreview = ({ transaction }: TransactionPreviewProps) => {
  const { budgets } = useStorage()
  const budget = budgets[transaction.budgetId]

  return (
    <div
      className="px-5 py-2 flex justify-between items-center rounded-full"
      style={{
        backgroundColor: budget.theme.background,
        color: budget.theme.foreground
      }}
    >
      <div className="font-heading font-medium text-lg icon-wrapper">
        <Landmark strokeWidth={1.5} />
        <span>{budget ? budget.name: '-'}</span>
      </div>

      <div className={`
        px-2 py-0.5 font-heading text-xl font-bold flex items-center gap-x-0.5 rounded-full
        ${transaction.type === TransactionType.PLUS ? 'bg-green-500/90' : 'bg-red-500/90'}
      `}>
        {transaction.type === TransactionType.PLUS ? (
          <Plus size={16} />
        ) : (
          <Minus size={16} />
        )}
        <span>${transaction.amount}</span>
      </div>
    </div>
  )
}

export default TransactionPreview
