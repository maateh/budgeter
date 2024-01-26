import { useState } from "react"

// icons
import { ChevronRightCircle, Plus } from "lucide-react"

// types
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// shadcn
import { Button } from "@/components/ui/button"

// components
import AddTransactionsPopover from "@/components/shared/AddTransactionsPopover"
import TransactionPreview from "@/components/shared/TransactionPreview"

type RecentTransactionsProps = {
  transactions: Transaction[]
  startingQuantity?: number
  loadingQuantity?: number
  budget?: Budget
}

const RecentTransactions = ({
  transactions,
  startingQuantity = 5,
  loadingQuantity = 0,
  budget
}: RecentTransactionsProps) => {
  const [slicedTransactions, setSlicedTransactions] = useState(
    transactions.slice(0, startingQuantity)
  )

  const handleSlice = () => {
    setSlicedTransactions(prev => {
      return transactions.slice(0, prev.length + loadingQuantity)
    })
  }

  return (
    <>
      <div className="mb-5 flex justify-between items-center">
        <h2>Recent <span className="text-yellow-300 overline">Transactions</span></h2>
        <AddTransactionsPopover budgetId={budget?.id}>
          <Button variant="icon" size="icon">
            <Plus />
          </Button>
        </AddTransactionsPopover>
      </div>

      <ul className="w-full px-2 grid gap-3">
        {slicedTransactions.map(tr => (
          <li key={tr.id}>
            <TransactionPreview transaction={tr} />
          </li>
        ))}
      </ul>

      {loadingQuantity > 0 && slicedTransactions.length < transactions.length && (
        <div className="w-full mt-4 flex justify-center items-center">
          <Button
            onClick={handleSlice}
            size="sm"
            className="flex items-center gap-x-1.5"
          >
            <span>Load More</span>
            <ChevronRightCircle size={20} />
          </Button>
        </div>
      )}
    </>
  )
}

export default RecentTransactions
