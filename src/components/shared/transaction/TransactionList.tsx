import { UUID } from "crypto"
import { useNavigate } from "react-router-dom"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"
import PaginationList from "@/components/pagination-list/PaginationList"

// hooks
import { useManualPagination } from "@/components/pagination-list/hooks"
import { usePaginatedTransactionsWithBudgets } from "@/lib/react-query/queries"

// types
import { Transaction } from "@/services/api/types"

type TransactionListProps = {
  type: Transaction['type']
  processed: Transaction['processed']
  budgetId?: UUID
  maxItemLimit?: number
}

const TransactionList = ({ type, processed, budgetId, maxItemLimit = 10 }: TransactionListProps) => {
  const navigate = useNavigate()

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = usePaginatedTransactionsWithBudgets({
    type, processed, budgetId
  })

  const { isLimitExceeded, handlePagination } = useManualPagination({
    data, fetchNextPage, maxItemLimit,
    actionAfterLimitExceeded: () => navigate('/transactions')
  })

  return !isLoading && data ? (
    <>
      <PaginationList pages={data.pages}>
        {(tr) => (
          <TransactionPreview budget={tr.budget} transaction={tr} />
        )}
      </PaginationList>

      {hasNextPage && (
        <Button className="w-fit mx-auto px-4"
          size="sm"
          onClick={handlePagination}
          disabled={isFetchingNextPage}
        >
          {isLimitExceeded ? 'View All' : 'Load More'}
        </Button>
      )}
    </>
  ) : <>Loading...</> // TODO: skeleton - preview
}

export default TransactionList
