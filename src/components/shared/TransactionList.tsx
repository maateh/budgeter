import { useState } from "react"
import { useNavigate } from "react-router-dom"

// icons
import { ChevronRightCircle, Plus } from "lucide-react"

// types
import { ModelCollection } from "@/types"
import Budget from "@/models/Budget"
import Transaction from "@/models/Transaction"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TransactionPreview from "@/components/shared/TransactionPreview"
import StatusSwitcher from "@/components/ui/custom/StatusSwitcher"
import FormDialog from "@/components/shared/FormDialog"
import TransactionFormTabs from "@/components/form/transaction/TransactionFormTabs"

type TransactionListProps = {
  transactions: Transaction[]
  startingQuantity?: number
  loadingQuantity?: number
  defaultStatus?: Transaction['status']
} & (
  | { budget: Budget; budgets?: never }
  | { budgets: ModelCollection['budget']; budget?: never }
)

const TransactionList = ({
  transactions,
  startingQuantity = 5,
  loadingQuantity = 0,
  defaultStatus = 'processed',
  budget,
  budgets
}: TransactionListProps) => {
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(startingQuantity)
  const [status, setStatus] = useState(defaultStatus)

  const handleViewMore = () => {
    if (loadingQuantity > 0 && transactions.length > quantity) {
      setQuantity(prev => prev + loadingQuantity)
    } else {
      navigate('/transactions')
    }
  }

  return (
    <>
      <div className="mb-5 flex justify-between items-center">
        <div className="flex items-center gap-x-1.5">
          <StatusSwitcher
            status={status}
            setStatus={setStatus}
            tooltip="Switch between transaction status types"
          />

          {status === 'processed' ? (
            <h2>Recent <span className="text-yellow-300 overline">Transactions</span></h2>
          ) : (
            <h2>Processing <span className="text-blue-500 overline">Transactions</span></h2>
          )}
        </div>
        <FormDialog
          title={<>Add <span className="text-yellow-400 overline">Transaction</span></>}
          form={<TransactionFormTabs budgetId={budget?.id} />}
        >
          <Button variant="icon" size="icon">
            <Plus />
          </Button>
        </FormDialog>
      </div>

      <ul className="w-full px-2 grid gap-3">
        {transactions.filter(tr => tr.status === status).slice(0, quantity).map(tr => (
          <li key={tr.id}>
            <TransactionPreview
              transaction={tr}
              budget={budget || budgets[tr.budgetId]}
            />
          </li>
        ))}
      </ul>

      {transactions.length > quantity && (
        <div className="w-full mt-4 flex justify-center items-center">
          <Button
            onClick={handleViewMore}
            size="sm"
            className="flex items-center gap-x-1.5"
          >
            <span>{loadingQuantity > 0 ? 'Load More' : 'View all'}</span>
            <ChevronRightCircle size={20} />
          </Button>
        </div>
      )}
    </>
  )
}

export default TransactionList
