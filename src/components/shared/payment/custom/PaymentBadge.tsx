/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from "react"

// icons
import { BadgeInfo, Minus, Plus, X } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import PaymentProgress from "@/components/shared/payment/PaymentProgress"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useRemoveSubpayment } from "@/lib/react-query/mutations"

// types
import { Budget, Payment, Transaction } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"
import { cn } from "@/lib/utils"

function isNeutral(type: Transaction['type'], processed: boolean): boolean {
  return ((type === 'default' && !processed) || (type === 'borrow' && processed))
}

function getPaymentAmount(payment: Payment, processed: boolean): number {
  const { processedAmount = 0, amount } = payment
  const difference = amount - processedAmount
  
  return processed ? amount
    : difference > 0 ? difference : amount
}

type PaymentBadgeProps = {
  payment: Payment
  processed: boolean
  currency: string
  isNeutral?: boolean
  iconSize?: number
  showRemoveButton?: boolean
} & BadgeProps & ({
  showProgress: boolean
  transaction: Transaction
  budget: Budget
} | {
  showProgress?: never
  transaction?: never
  budget?: never
})

const PaymentBadge = forwardRef<HTMLDivElement, PaymentBadgeProps>(({
  payment, processed, currency, isNeutral, iconSize = 16, showRemoveButton,
  showProgress, transaction, budget,
  className, size = 'sm', ...props
}, ref) => {
  const { toast } = useToast()

  const { mutateAsync: removeSubpayment, isPending } = useRemoveSubpayment(payment.transactionId)

  const handleRemove = async () => {
    try {
      await removeSubpayment({
        transactionId: payment.transactionId,
        paymentId: payment.id
      })

      toast({
        title: `Removed payment: ${formatWithCurrency(
          getPaymentAmount(payment, processed),
          currency
        )}`,
        description: transaction ? `Affected transaction: ${transaction.name}` : ''
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: 'Oops! Deletion failed.',
        description: 'Please try again.'
      })
    }
  }

  const element: React.ReactNode = (
    <Badge className={cn("font-heading font-bold gap-x-1",
        showProgress ? 'cursor-pointer' : '',
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

  return !showProgress ? element : (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {element}
      </PopoverTrigger>
      <PopoverContent className="max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {transaction.type === 'borrow' && !payment.isSubpayment ? (
          <PaymentProgress
            transaction={transaction}
            budget={budget}
          />
        ) : (
          <div className="icon-wrapper">
            <BadgeInfo size={18} />
            <span className="text-sm">
              {transaction.processed
                ? `Payment has been credited to "${budget.name}" budget.`
                : "Payment hasn't been credited yet."}
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
})

export { isNeutral }
export default PaymentBadge
