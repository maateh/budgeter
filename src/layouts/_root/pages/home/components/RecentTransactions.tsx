// shadcn
import { Button } from "@/components/ui/button"

// components
import AddTransactionsPopover from "@/components/shared/AddTransactionsPopover"
import TransactionPreview from "@/components/shared/TransactionPreview"

// icons
import { Plus } from "lucide-react"

// context
import useStorage from "@/layouts/_root/context/useStorage"

const RecentTransactions = () => {
  const { transactions } = useStorage()

  return (
    <>
      <div className="mb-5 flex justify-between">
        <h2>Recent <span className="text-red-600 overline">Transactions</span></h2>
        <AddTransactionsPopover>
          <Button variant="icon" size="icon">
            <Plus />
          </Button>
        </AddTransactionsPopover>
      </div>

      <ul className="w-full grid gap-3">
        {Object.values(transactions).slice(0, 7).map(tr => (
          <li key={tr.id}>
            <TransactionPreview transaction={tr} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default RecentTransactions
