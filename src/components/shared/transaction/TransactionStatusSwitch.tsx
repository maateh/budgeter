// icons
import { BadgeCheck, XCircle } from "lucide-react"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// hooks
import { useUpdateTransactionStatus } from "@/lib/react-query/mutations"

// types
import { Transaction } from "@/services/api/types"

type TransactionStatusSwitchProps = {
  transaction: Transaction
}

const TransactionStatusSwitch = ({ transaction }: TransactionStatusSwitchProps) => {
  const { mutateAsync: updateTransactionStatus } = useUpdateTransactionStatus(transaction.id)

  const handleUpdateStatus = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
        processed: (
          <BadgeCheck className="text-green-600 dark:text-green-500"
            size={20}
            strokeWidth={2.5}
          />
        ),
        unprocessed: <XCircle className="text-destructive" size={20} strokeWidth={2.5} />
      }}
      tooltip={{
        processed: 'Click to withdraw',
        unprocessed: 'Click for crediting'
      }}
      action={handleUpdateStatus}
      toggleOnHover
    />
  )
}

export default TransactionStatusSwitch
