import { forwardRef } from "react"

// icons
import { Minus, Plus, X } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// types
import { Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"
import { cn } from "@/lib/utils"

type PaymentBadgeProps = {
  transaction: Pick<Transaction, 'payment' | 'type' | 'processed'>
  currency: string
  iconSize?: number
  showRemoveButton?: boolean
} & BadgeProps

const PaymentBadge = forwardRef<HTMLDivElement, PaymentBadgeProps>(({
  transaction, currency, iconSize = 16, showRemoveButton, size = 'sm', className, ...props
}, ref) => {
  const { payment, type, processed } = transaction

  const isNeutral = (type === 'default' && !processed) ||
                    (type === 'borrow' && processed)

  return (
    <Badge className={cn("font-heading font-bold gap-x-1",
        isNeutral ? 'text-muted-foreground opacity-75'
          : payment.type === '+' ? 'text-accent' : 'text-destructive', className)}
      size={size}
      ref={ref}
      {...props}
    >
      <div className="flex gap-x-1.5 items-center">
        {payment.type === '+' ? (
          <Plus size={iconSize} strokeWidth={7.5} />
        ) : (
          <Minus size={iconSize} strokeWidth={7.5} />
        )}
        <span>{formatWithCurrency(payment.amount, currency)}</span>
      </div>

      {showRemoveButton && (
        <Button className="ml-1 p-0.5"
          variant="outline"
          size="icon"
          onClick={() => {/* TODO: handle payment remove */}}
        >
          <X size={12} />
        </Button>
      )}
    </Badge>
  )
})

export default PaymentBadge
