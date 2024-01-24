// shadcn
import { Button } from "@/components/ui/button"

// components
import AddTransactionsPopover from "@/components/shared/AddTransactionsPopover"

// icons
import { Plus } from "lucide-react"

const RecentTransactions = () => {
  return (
    <>
      <div className="flex justify-between">
        <h2>Recent <span className="text-red-600 overline">Transactions</span></h2>
        <AddTransactionsPopover>
          <Button variant="icon" size="icon">
            <Plus />
          </Button>
        </AddTransactionsPopover>
      </div>
    </>
  )
}

export default RecentTransactions
