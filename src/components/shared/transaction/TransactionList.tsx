import { useNavigate } from "react-router-dom"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import PaginationList from "@/components/ui/custom/PaginationList"

// hooks
import { useTransactionsPagination } from "@/lib/react-query/queries"
import { usePagination } from "@/hooks"

// types
import { Budget, FilterOptions, Transaction } from "@/services/api/types"

type TransactionListProps = {
  maxItemLimit?: number
  children: ({ transaction, budget }: { transaction: Transaction, budget: Budget }) => React.ReactNode
} & FilterOptions<Transaction>

const TransactionList = ({ filterBy, excludeBy, maxItemLimit = 10, children }: TransactionListProps) => {
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
        {({ budget, ...transaction }) => children({ transaction, budget })}
        {/* {(tr) => (
          <TransactionPreview budget={tr.budget} transaction={tr} />
        )} */}
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
