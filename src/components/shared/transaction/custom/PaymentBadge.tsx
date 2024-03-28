/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from "react"

// icons
import { Minus, Plus, X } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// hooks
import { useRemoveSubpayment } from "@/lib/react-query/mutations"

// types
import { Payment, Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"
import { cn } from "@/lib/utils"

export function isNeutral(type: Transaction['type'], processed: boolean): boolean {
  return ((type === 'default' && !processed) || (type === 'borrow' && processed))
}

function getPaymentAmount(payment: Payment, processed: boolean): number {
  const difference = payment.amount - (payment.paidBackAmount || 0)

  return processed ? payment.amount
    : difference > 0 ? difference
    : payment.amount
}

type PaymentBadgeProps = {
  payment: Payment
  processed: boolean
  currency: string
  isNeutral?: boolean
  iconSize?: number
  showRemoveButton?: boolean
} & BadgeProps

const PaymentBadge = forwardRef<HTMLDivElement, PaymentBadgeProps>(({
  payment, processed, currency, isNeutral, iconSize = 16, showRemoveButton, size = 'sm', className, ...props
}, ref) => {
  const { mutateAsync: removeSubpayment, isPending } = useRemoveSubpayment(payment.transactionId)

  const handleRemove = async () => {
    try {
      await removeSubpayment({
        transactionId: payment.transactionId,
        paymentId: payment.id
      })

      // TODO: show toast
    } catch (err) {
      console.error(err)
    }
  }

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
        <span>
          {formatWithCurrency(
            getPaymentAmount(payment, processed),
            currency
          )}
        </span>
      </div>

      {showRemoveButton && (
        <Button className="ml-1 -mr-0.5 p-0.5"
          variant="outline"
          size="icon"
          onClick={handleRemove}
          disabled={isPending}
        >
          <X size={12} />
        </Button>
      )}
    </Badge>
  )
})

export default PaymentBadge
