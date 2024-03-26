// icons
import { BadgeCheck, Coins, XCircle } from "lucide-react"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// hooks
import { useUpdateTransactionStatus } from "@/lib/react-query/mutations"

// types
import { Transaction } from "@/services/api/types"

type TransactionStatusToggleProps = {
  transaction: Transaction
}

const TransactionStatusToggle = ({ transaction }: TransactionStatusToggleProps) => {
  const { mutateAsync: updateTransactionStatus } = useUpdateTransactionStatus(transaction.id)

  const handleUpdateStatus = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

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
      icon={{
        processed: transaction.type !== 'transfer' ? (
          <BadgeCheck className="text-green-700 dark:text-green-400"
            size={20}
            strokeWidth={2.5}
          />
        ) : (
          <Coins className="text-blue-600 dark:text-blue-400"
            size={20}
            strokeWidth={2.5}
          />
        ),
        unprocessed: <XCircle className="text-destructive" size={20} strokeWidth={2.5} />
      }}
      tooltip={{
        processed: transaction.type !== 'transfer' ? 'Click to withdraw' : 'Transfers cannot be withdrawn.',
        unprocessed: 'Click for crediting'
      }}
      onClick={transaction.type !== 'transfer' ? handleUpdateStatus : undefined}
      toggleOnHover
      toggleDisabled={transaction.type === 'transfer'}
    />
  )
}

export default TransactionStatusToggle
