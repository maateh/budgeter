// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

// models
import Transaction, { TransactionType } from "@/models/Transaction"

type TransactionBadgeProps = {
  transaction: Transaction
  size?: BadgeProps['size']
  iconSize?: number
}

const TransactionBadge = ({ transaction, size = 'md', iconSize = 16 }: TransactionBadgeProps) => {
  return (
    <Badge
      size={size}
      variant={transaction.type === TransactionType.PLUS ? 'positive' : 'negative'}
      className="font-heading font-bold gap-x-1.5"
    >
      {transaction.type === TransactionType.PLUS ? (
        <Plus size={iconSize} strokeWidth={7.5} />
      ) : (
        <Minus size={iconSize} strokeWidth={7.5} />
      )}
      <span>${transaction.amount}</span>
    </Badge>
  )
}

export default TransactionBadge
