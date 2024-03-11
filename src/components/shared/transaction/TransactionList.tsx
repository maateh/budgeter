import { UUID } from "crypto"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"

// hooks
import { useGetTransactionsWithBudgets } from "@/lib/react-query/queries"

// types
import { Transaction } from "@/services/api/types"

type TransactionListProps = {
  type: Transaction['type']
  processed: Transaction['processed']
  budgetId?: UUID
}

const TransactionList = ({ type, processed, budgetId }: TransactionListProps) => {
  const navigate = useNavigate()

  const {
    data, isLoading, isFetchingNextPage, fetchNextPage
  } = useGetTransactionsWithBudgets(type, processed, budgetId)

  const nextPageOffset = useMemo(() => {
    if (!data) return

    const lastIndex = data.pages.length - 1
    return data!.pages[lastIndex].nextPageOffset
  }, [data])

  const handlePagination = () => {
    if (nextPageOffset && nextPageOffset >= 10) {
      navigate('/transactions')
      return
    }

    fetchNextPage()
  }

  return !isLoading && data ? (
    <>
      <ul className="grid gap-y-2.5">
        {data.pages.map((page) => page.data.map((tr) => (
          <li key={tr.id}>
            <TransactionPreview budget={tr.budget} transaction={tr} />
          </li>
        )))}
      </ul>
      
      {nextPageOffset && (
        <Button className="w-fit mx-auto px-4"
          variant="outline"
          size="sm"
          onClick={handlePagination}
          disabled={isLoading || isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...'
            : nextPageOffset >= 10 ? 'View All' : 'Load More'}
        </Button>
      )}
    </>
  ) : <>Loading...</> // TODO: skeleton - preview
}

export default TransactionList
