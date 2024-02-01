// shadcn
import { Badge } from "@/components/ui/badge"

// models
import Transaction, { TransactionType } from "@/models/Transaction";

type TransactionBadgeProps = {
  transaction: Transaction;
}

const TransactionBadge = ({ transaction }: TransactionBadgeProps) => {
  return (
    <Badge
    size="xs"
      variant={transaction.type === TransactionType.PLUS ? "positive" : "negative"}
    >
      {transaction.type}${transaction.amount}
    </Badge>
  )
}

export default TransactionBadge
