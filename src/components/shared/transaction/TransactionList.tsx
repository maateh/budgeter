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
import { Budget, QueryOptions, Transaction } from "@/services/api/types"

type TransactionListProps = {
  maxItemLimit?: number
  children: (transaction: Transaction, budget: Budget) => React.ReactNode
} & QueryOptions<Transaction>

const TransactionList = ({ params, filter, maxItemLimit, children }: TransactionListProps) => {
  const navigate = useNavigate()

  const {
    data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage
  } = useTransactionsPagination({ filter, params })

  const { isLimitExceeded, manualPagination } = usePagination({
    data, fetchNextPage, maxItemLimit,
    actionAfterLimitExceeded: () => navigate('/transactions')
  })

  return !isLoading && data ? (
    <>
      <PaginationList pages={data.pages}>
        {({ budget, ...transaction }) => children(transaction, budget)}
      </PaginationList>

      {hasNextPage && (
        <Button className="w-fit mt-1 mx-auto icon-wrapper"
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
