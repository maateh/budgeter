import { forwardRef } from "react"

// icons
import { BadgeInfo, LucideProps, Minus, Plus, Trash2, X } from "lucide-react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"
import { ButtonTooltip, ButtonProps } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import PaymentProgress from "@/components/shared/payment/PaymentProgress"

// types
import { Payment, Transaction } from "@/services/api/types"

// utils
import { getPaymentAmount } from "@/components/shared/payment/utils"
import { formatWithCurrency } from "@/utils"
import { cn } from "@/lib/utils"

type PaymentBadgeProps = BadgeProps & {
  payment: Payment
  processed: boolean
  currency: string
  isNeutral?: boolean
  iconProps?: LucideProps
} & ({
  showProgress?: true
  showDetailsOnly?: boolean
  transaction: Transaction
  budgetName?: string
} | {
  showProgress?: never
  showDetailsOnly?: never
  transaction?: never
  budgetName?: never
}) & ({
  showRemoveButton: true
  onRemove: () => void
  removeButtonProps?: Omit<ButtonProps, 'onClick'>
} | {
  showRemoveButton?: never
  onRemove?: never
  removeButtonProps?: never
})

const PaymentBadge = forwardRef<HTMLDivElement, PaymentBadgeProps>(({
  payment, processed, currency, isNeutral, iconProps,
  showProgress, showDetailsOnly, transaction, budgetName,
  showRemoveButton, onRemove, removeButtonProps,
  className, size = 'sm', ...props
}, ref) => {
  const element: React.ReactNode = (
    <Badge className={cn("bg-background/60 font-heading font-bold gap-x-1 hover:bg-primary/90",
        payment.type === '+' ? 'bg-accent/10 border-accent/25' : 'bg-destructive/10 border-destructive/25',
        showProgress ? 'cursor-pointer' : '',
        isNeutral ? 'text-muted-foreground bg-muted/10 border-muted/25 opacity-75'
          : payment.type === '+' ? 'text-accent' : 'text-destructive', className)}
      size={size}
      ref={ref}
      {...props}
    >
      <div className="icon-wrapper">
        {payment.type === '+' ? (
          <Plus {...iconProps}
            className={cn("size-2.5 sm:size-4", iconProps?.className)}
            strokeWidth={iconProps?.strokeWidth || 7.5}
          />
        ) : (
          <Minus {...iconProps}
            className={cn("size-2.5 sm:size-4", iconProps?.className)}
            strokeWidth={iconProps?.strokeWidth || 7.5}
          />
        )}
        <span>
          {formatWithCurrency(
            getPaymentAmount({
              amount: payment.amount,
              processedAmount: transaction ? transaction.payment.processedAmount : undefined,
              processed
            }),
            currency
          )}
        </span>
      </div>

      {showRemoveButton && (
        <ButtonTooltip {...removeButtonProps}
          className={cn("ml-1 -mr-0.5 p-0.5", removeButtonProps?.className)}
          variant={removeButtonProps?.variant || 'outline'}
          size={removeButtonProps?.size || 'icon'}
          onClick={onRemove}
          tooltip={(
            <div className="icon-wrapper">
              <Trash2 className="text-destructive" size={18} strokeWidth={2.35} />
              Click to remove subpayment
            </div>
          )}
          tooltipProps={{ className: 'font-normal' }}
        >
          <X size={12} />
        </ButtonTooltip>
      )}
    </Badge>
  )

  return !showProgress && !showDetailsOnly ? element : (
    <Popover>
      <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
        {element}
      </PopoverTrigger>
      <PopoverContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
        {transaction.type === 'borrow' && !showDetailsOnly ? (
          <PaymentProgress transaction={transaction} />
        ) : (
          <div className="icon-wrapper">
            <BadgeInfo size={18} />
            <span className="text-sm">
              {transaction.payment.processed
                ? `Payment has been credited to "${budgetName}" budget.`
                : "Payment hasn't been credited yet."}
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
})

export default PaymentBadge
