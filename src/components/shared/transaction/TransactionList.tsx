import { UUID } from "crypto"

// components
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"

// hooks
import { useGetTransactionsWithBudgets } from "@/lib/react-query/queries"

// types
import { Transaction } from "@/services/api/types"

type TransactionListProps = {
  budgetId?: UUID
  type: Transaction['type']
}

const TransactionList = ({ budgetId, type }: TransactionListProps) => {
  // TODO: later it'll be required a pagination query
  // but for now it's okay for testing
  const { data: transactions, isLoading } = useGetTransactionsWithBudgets(type, budgetId)

  return (
    <>
      {!isLoading && transactions ? (
        <ul className="grid gap-y-2.5">
          {transactions.map((tr) => (
            <li key={tr.id}>
              <TransactionPreview budget={tr.budget} transaction={tr} />
            </li>
          ))}
        </ul>
      ) : (
        <>Loading...</> // TODO: skeleton
      )}
    </>
  )
}

export default TransactionList
