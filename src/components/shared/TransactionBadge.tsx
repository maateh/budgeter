// shadcn
import { Badge } from "@/components/ui/badge"

// models
import Transaction, { TransactionType } from "@/models/Transaction";

type TransactionBadgeProps = {
  transaction: Transaction;
}

const TransactionBadge = ({ transaction }: TransactionBadgeProps) => {
  return (
    <Badge variant={
      transaction.type === TransactionType.INCOME
        ? "positive"
        : "negative"
    }>
      {transaction.type === TransactionType.INCOME ? '+' : '-'}${Math.abs(transaction.amount)}
    </Badge>
  )
}

export default TransactionBadge
