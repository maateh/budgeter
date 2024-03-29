import { forwardRef } from "react"

// icons
import { BadgeCheck, Banknote, Coins, LucideProps, XCircle } from "lucide-react"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// hooks
import { useUpdateTransactionStatus } from "@/lib/react-query/mutations"

// types
import { Transaction } from "@/services/api/types"

const getIcon = (type: Transaction['type'], iconProps?: LucideProps): { processed: React.ReactNode; unprocessed: React.ReactNode } => {
  return {
    processed: type === 'default' ? (
      <BadgeCheck className="text-green-700 dark:text-green-400" {...iconProps} />
    ) : type === 'borrow' ? (
      <Banknote className="text-green-700 dark:text-green-400" {...iconProps} />
    ) : (
      <Coins className="text-blue-600 dark:text-blue-400" {...iconProps} />
    ),
    unprocessed: type === 'borrow' ? (
      <Banknote className="text-destructive" {...iconProps} />
    ) : (
      <XCircle className="text-destructive" {...iconProps} />
    )
  }
}

const getTooltip = (type: Transaction['type']): { processed: string; unprocessed: string } => {
  if (type === 'transfer') {
    return {
      processed: 'Transfers cannot be withdrawn.',
      unprocessed: ''
    }
  }

  if (type === 'borrow') {
    return {
      processed: 'Click to manage subpayments',
      unprocessed: 'Click to manage subpayments'
    }
  }

  return {
    processed: 'Click to withdraw',
    unprocessed: 'Click for crediting'
  }
}

type TransactionStatusToggleProps = {
  transaction: Transaction
  iconProps?: LucideProps
  showTooltip?: boolean
}

const TransactionStatusToggle = forwardRef<HTMLButtonElement, TransactionStatusToggleProps>(({
  transaction, iconProps, showTooltip
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

  return (
    <StateToggle
      status={transaction.processed ? 'processed' : 'unprocessed'}
      icon={getIcon(transaction.type, iconProps)}
      tooltip={showTooltip ? getTooltip(transaction.type) : undefined}
      onClick={transaction.type === 'default' ? handleUpdateStatus : undefined}
      toggleOnHover={transaction.type === 'default'}
      forwardedRef={ref}
    />
  )
})

export default TransactionStatusToggle
