import { useNavigate } from "react-router-dom"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import Listing from "@/components/ui/custom/Listing"

// hooks
import { usePagination } from "@/hooks"
import { useTransactionsPagination } from "@/lib/react-query/queries"

// types
import { Budget, QueryOptions, Transaction } from "@/services/api/types"

type TransactionListProps = {
  children: (transaction: Transaction, budget: Budget) => React.ReactNode
} & QueryOptions<Transaction>

const TransactionList = ({ params, filter, children }: TransactionListProps) => {
  const navigate = useNavigate()

  const {
    data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage
  } = useTransactionsPagination({ filter, params, sortBy: { updatedAt: -1 } })

  const { isLimitExceeded, manualPagination } = usePagination({
    data, fetchNextPage, maxItemLimit: params?.maxItemLimit,
    actionAfterLimitExceeded: () => navigate('/transactions')
  })

  return !isLoading && data ? (
    <>
      <Listing pages={data.pages}
        fallbackProps={{
          className: 'w-fit mx-auto mt-2',
          value: 'There is no transaction to display.',
          size: 'lg'
        }}
      >
        {({ budget, ...transaction }) => children(transaction, budget)}
      </Listing>

      {(hasNextPage || isLimitExceeded) && (
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
