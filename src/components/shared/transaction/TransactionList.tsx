import { UUID } from "crypto"
import { useNavigate } from "react-router-dom"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"
import PaginationList from "@/components/ui/custom/PaginationList"

// hooks
import { useGetTransactionsWithBudgets } from "@/lib/react-query/queries"

// types
import { Transaction } from "@/services/api/types"

// utils
import { getNextPageOffset } from "@/utils"

type TransactionListProps = {
  type: Transaction['type']
  processed: Transaction['processed']
  budgetId?: UUID
}

const MAX_ITEM_LIMIT = 10

const TransactionList = ({ type, processed, budgetId }: TransactionListProps) => {
  const navigate = useNavigate()

  const {
    data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage
  } = useGetTransactionsWithBudgets(type, processed, budgetId)

  const nextPageOffset = getNextPageOffset(data)

  const handlePagination = () => {
    if (nextPageOffset && nextPageOffset >= MAX_ITEM_LIMIT) {
      navigate('/transactions')
      return
    }

    fetchNextPage()
  }

  return !isLoading && data ? (
    <>
      <PaginationList pages={data.pages}>
        {(tr) => (
          <TransactionPreview budget={tr.budget} transaction={tr} />
        )}
      </PaginationList>

      {hasNextPage && (
        <Button className="w-fit mx-auto px-4"
          variant="outline"
          size="sm"
          onClick={handlePagination}
          disabled={isLoading || isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...'
            : nextPageOffset && nextPageOffset >= MAX_ITEM_LIMIT ? 'View All' : 'Load More'}
        </Button>
      )}
    </>
  ) : <>Loading...</> // TODO: skeleton - preview
}

export default TransactionList
