import { forwardRef } from "react"

// icons
import { BadgeCheck, Banknote, Coins, LucideProps, XCircle } from "lucide-react"

// shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import StateToggle from "@/components/ui/custom/StateToggle"
import PaymentProgress from "@/components/shared/payment/PaymentProgress"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useUpdateTransactionStatus } from "@/lib/react-query/mutations"

// types
import { Transaction } from "@/services/api/types"

const getIcon = (type: Transaction['type'], iconProps?: LucideProps): { on: React.ReactNode; off: React.ReactNode } => {
  return {
    on: type === 'default' ? (
      <BadgeCheck className="text-green-700 dark:text-green-400" {...iconProps} />
    ) : type === 'borrow' ? (
      <Banknote className="text-green-700 dark:text-green-400" {...iconProps} />
    ) : (
      <Coins className="text-blue-600 dark:text-blue-400" {...iconProps} />
    ),
    off: type === 'borrow' ? (
      <Banknote className="text-destructive" {...iconProps} />
    ) : (
      <XCircle className="text-destructive" {...iconProps} />
    )
  }
}

const getTooltip = (type: Transaction['type']): { on: string; off: string } => {
  if (type === 'transfer') {
    return {
      on: 'Transfers cannot be withdrawn.',
      off: ''
    }
  }

  if (type === 'borrow') {
    return {
      on: 'Click to manage subpayments',
      off: 'Click to manage subpayments'
    }
  }

  return {
    on: 'Click to withdraw',
    off: 'Click for crediting'
  }
}

type TransactionStatusToggleProps = {
  transaction: Transaction
  iconProps?: LucideProps
}

// FIXME: rename to PaymentStatusToggle
const TransactionStatusToggle = forwardRef<HTMLButtonElement, TransactionStatusToggleProps>(({
  transaction, iconProps
}, ref) => {
  const { toast } = useToast()
  
  const { mutateAsync: updateTransactionStatus, isPending } = useUpdateTransactionStatus(transaction.id)

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    if (transaction.type !== 'default') return

    try {
      await updateTransactionStatus({
        id: transaction.id,
        processed: !transaction.payment.processed
      })

      toast({
        variant: 'accent',
        title: 'Updated: Transaction status',
        description: `Status of the "${transaction.name}" transaction has been successfully updated!`
      })
    } catch (err) {
      console.error(err)
      
      toast({
        variant: 'destructive',
        title: 'Oops! Failed to update transaction status.',
        description: 'Please try again.'
      })
    }
  }

  const toggleElement = (
    <StateToggle
      status={transaction.payment.processed ? 'on' : 'off'}
      icon={getIcon(transaction.type, iconProps)}
      tooltip={getTooltip(transaction.type)}
      onClick={transaction.type === 'default' ? handleUpdate : undefined}
      disabled={isPending}
      toggleOnHover={transaction.type === 'default'}
      ref={ref}
    />
  )

  return transaction.type !== 'borrow' ? toggleElement : (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {toggleElement}
      </PopoverTrigger>
      <PopoverContent className="max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <PaymentProgress transaction={transaction} />
      </PopoverContent>
    </Popover>
  )
})

export default TransactionStatusToggle
