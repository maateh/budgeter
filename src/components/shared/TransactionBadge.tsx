// shadcn
import { Badge } from "@/components/ui/badge"

// models
import Transaction from "@/models/Transaction";
// import Transaction, { TransactionType } from "@/models/Transaction";

type TransactionBadgeProps = {
  transaction: Transaction;
}

const TransactionBadge = ({ transaction }: TransactionBadgeProps) => {
  return (
    <Badge variant={transaction.amount >= 0 ? "positive" : "negative"}>
      {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount)}
    </Badge>
  )
}

export default TransactionBadge
