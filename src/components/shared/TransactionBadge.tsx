import { Badge } from "@/components/ui/badge"

type TransactionBadgeProps = {
    amount: number;
}

const TransactionBadge = ({ amount }: TransactionBadgeProps) => {
  return (
    <Badge variant={amount > 0 ? "positive" : "negative"}>
      {amount > 0 ? '+' : '-'}${Math.abs(amount)}
    </Badge>
  )
}

export default TransactionBadge
