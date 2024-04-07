import { forwardRef } from "react"

// icons
import { BadgeCheck, Banknote, Coins, LucideProps, XCircle } from "lucide-react"

// components
import StateToggle from "@/components/ui/custom/StateToggle"
import PaymentProgress from "@/components/shared/payment/PaymentProgress"

// hooks
import { useUpdateTransactionStatus } from "@/lib/react-query/mutations"

// types
import { Budget, Transaction } from "@/services/api/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  budget: Budget
  iconProps?: LucideProps
}

const TransactionStatusToggle = forwardRef<HTMLButtonElement, TransactionStatusToggleProps>(({
  transaction, budget, iconProps
}, ref) => {
  const { mutateAsync: updateTransactionStatus } = useUpdateTransactionStatus(transaction.id)

  const handleUpdateStatus = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    if (transaction.type !== 'default') return

    try {
      await updateTransactionStatus({
        id: transaction.id,
        processed: !transaction.processed
      })

      // TODO: add toast message
    } catch (err) {
      console.error(err)
    }
  }

  const toggleElement = (
    <StateToggle
      status={transaction.processed ? 'on' : 'off'}
      icon={getIcon(transaction.type, iconProps)}
      tooltip={getTooltip(transaction.type)}
      onClick={transaction.type === 'default' ? handleUpdateStatus : undefined}
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
        <PaymentProgress
          transaction={transaction}
          budget={budget}
        />
      </PopoverContent>
    </Popover>
  )
})

export default TransactionStatusToggle
