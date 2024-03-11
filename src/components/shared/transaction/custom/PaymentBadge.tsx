import { forwardRef } from "react"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

// types
import { Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"
import { cn } from "@/lib/utils"

type PaymentBadgeProps = {
  transaction: Transaction
  currency: string
  iconSize?: number
} & BadgeProps

const PaymentBadge = forwardRef<HTMLDivElement, PaymentBadgeProps>(({
  transaction, currency, iconSize = 16, size = 'sm', className, ...props
}, ref) => {
  const { payment, type, processed } = transaction

  const isNeutral = (type === 'default' && !processed) ||
                    (type === 'borrow' && processed)

  return (
    <Badge className={cn("font-heading font-bold gap-x-1.5",
        isNeutral ? 'text-muted-foreground'
          : payment.type === '+' ? 'text-accent' : 'text-destructive', className)}
      size={size}
      ref={ref}
      {...props}
    >
      {payment.type === '+' ? (
        <Plus size={iconSize} strokeWidth={7.5} />
      ) : (
        <Minus size={iconSize} strokeWidth={7.5} />
      )}
      <span>{formatWithCurrency(payment.amount, currency)}</span>
    </Badge>
  )
})

export default PaymentBadge