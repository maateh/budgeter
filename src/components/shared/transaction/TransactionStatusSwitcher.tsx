import { useState } from "react"

// icons
import { BadgeCheck, XCircle } from "lucide-react"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

// hooks
import { useUpdateTransactionStatus } from "@/lib/react-query/mutations"

// types
import { Transaction } from "@/services/api/types"

type TransactionStatusSwitcherProps = {
  transaction: Transaction
}

const TransactionStatusSwitcher = ({ transaction }: TransactionStatusSwitcherProps) => {
  const [isHovered, setIsHovered] = useState(false)

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="hover:bg-foreground/5"
            variant="ghost"
            size="icon-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleUpdateStatus}
          >            
            {transaction.processed ? isHovered ? (
              <XCircle className="text-destructive"
                size={20}
                strokeWidth={2.5}
              />
            ) : (
              <BadgeCheck className="text-green-600 dark:text-green-500"
                size={20}
                strokeWidth={2.5}
              />
            ) : isHovered ? (
              <BadgeCheck className="text-green-600 dark:text-green-500"
                size={20}
                strokeWidth={2.5}
              />
            ) : (
              <XCircle className="text-destructive"
                size={20}
                strokeWidth={2.5}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="font-heading font-medium tracking-wide">
          {transaction.processed ? 'Click to withdraw' : 'Click for crediting'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TransactionStatusSwitcher
