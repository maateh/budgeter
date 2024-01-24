// shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import TransactionForm from "@/components/form/TransactionForm"

type AddTransactionsPopoverProps = {
  budgetId?: string
  children: JSX.Element
}

const AddTransactionsPopover = ({ budgetId, children }: AddTransactionsPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        <p className="pb-1 mb-2 text-lg font-medium font-heading border-b border-border/25">
          Add Transactions
        </p>
        <TransactionForm budgetId={budgetId} />
      </PopoverContent>
    </Popover>
  )
}

export default AddTransactionsPopover