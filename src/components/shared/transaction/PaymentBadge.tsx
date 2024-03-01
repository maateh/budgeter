// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

// types
import { Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

type PaymentBadgeProps = {
  transaction: Transaction
  currency: string
  size?: BadgeProps['size']
  iconSize?: number
}

const PaymentBadge = ({ transaction, currency, size = 'sm', iconSize = 16 }: PaymentBadgeProps) => {
  const { payment } = transaction

  const isNeutral = (transaction.type === 'default' && !transaction.processed)
    || (transaction.type === 'borrow' && transaction.processed)

  return (
    <Badge
      size={size}
      className={`font-heading font-bold gap-x-1.5
        ${isNeutral ? 'text-muted-foreground'
          : payment.type === '+' ? 'text-accent' : 'text-destructive'}
      `}
    >
      {payment.type === '+' ? (
        <Plus size={iconSize} strokeWidth={7.5} />
      ) : (
        <Minus size={iconSize} strokeWidth={7.5} />
      )}
      <span>{formatWithCurrency(payment.amount, currency)}</span>
    </Badge>
  )
}

export default PaymentBadge
