import { UUID } from "crypto"

// components
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"

// hooks
import { useLoadBudgetQuery, useLoadTransactionsQuery } from "@/lib/react-query/queries"

// types
import { Transaction } from "@/services/api/types"

type TransactionListProps = {
  budgetId?: UUID
  type: Transaction['type']
}

const TransactionList = ({ budgetId, type }: TransactionListProps) => {
  // TODO: change query based on budgetId, transaction type and status
  const { data: transactions, isLoading } = useLoadTransactionsQuery(type)
  const { data: budget } = useLoadBudgetQuery()

  return (
    <>
      {!isLoading && transactions && budget ? (
        <ul>
          {Object.values(transactions).map(tr => (
            <li key={tr.id}>
              <TransactionPreview budget={budget} transaction={tr} />
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
