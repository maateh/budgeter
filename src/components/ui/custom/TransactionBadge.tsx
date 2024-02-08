// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

// models
import Transaction, { TransactionType } from "@/models/Transaction"

// utils
import { formatWithCurrency } from "@/utils"

type TransactionBadgeProps = {
  transaction: Transaction
  currency: string
  size?: BadgeProps['size']
  iconSize?: number
}

const TransactionBadge = ({ transaction, currency, size = 'md', iconSize = 16 }: TransactionBadgeProps) => {
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
      <span>{formatWithCurrency(transaction.amount, currency)}</span>
    </Badge>
  )
}

export default TransactionBadge
