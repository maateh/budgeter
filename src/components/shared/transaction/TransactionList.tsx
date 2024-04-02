import { useNavigate } from "react-router-dom"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import TransactionPreview from "@/components/shared/transaction/TransactionPreview"
import PaginationList from "@/components/pagination-list/PaginationList"

// hooks
import { usePagination } from "@/components/pagination-list/hooks"
import { useTransactionsPagination } from "@/lib/react-query/queries"

// types
import { FilterOptions, Transaction } from "@/services/api/types"

type TransactionListProps = {
  maxItemLimit?: number
} & FilterOptions<Transaction>

const TransactionList = ({ filterBy, excludeBy, maxItemLimit = 10 }: TransactionListProps) => {
  const navigate = useNavigate()

  const {
    data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage
  } = useTransactionsPagination({ filter: { filterBy, excludeBy } })

  const { isLimitExceeded, manualPagination } = usePagination({
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
        <Button className="w-fit mx-auto icon-wrapper"
          size="sm"
          onClick={manualPagination}
          disabled={isFetchingNextPage}
        >
          {isLimitExceeded ? 'View All' : 'Load More'}
          <ChevronRightCircle size={18} />
        </Button>
      )}
    </>
  ) : <>Loading...</> // TODO: skeleton - preview
}

export default TransactionList
