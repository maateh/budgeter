import { useLocation, useNavigate } from "react-router-dom"

// icons
import { WalletCards } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import PaginationList from "@/components/pagination-list/PaginationList"
import BudgetPreview from "@/components/shared/budget/BudgetPreview"

// hooks
import { useScrollingPagination } from "@/components/pagination-list/hooks"
import { useGetBudgetsWithTransactions } from "@/lib/react-query/queries"

export type BudgetListProps = {
  maxItemLimit?: number
  recentTransactionsLimit?: number
  paginationLimit?: number
}

const BudgetList = ({
  maxItemLimit,
  recentTransactionsLimit = 7,
  paginationLimit = 6
}: BudgetListProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useGetBudgetsWithTransactions({
    recentTransactionsLimit,
    paginationLimit: maxItemLimit || paginationLimit
  })

  const { lastPage, observerRef } = useScrollingPagination({
    data, fetchNextPage, maxItemLimit
  })

  return !isLoading && data ? (
    <>
      <PaginationList className="flex flex-row flex-wrap justify-around gap-x-6 gap-y-4"
        itemProps={{ className: "flex-1 w-full sm:min-w-72 max-w-lg" }}
        pages={data.pages}
      >
        {(budget) => (
          <BudgetPreview budget={budget} />
        )}
      </PaginationList>

      <div className="flex justify-center">
        {maxItemLimit && lastPage?.nextPageOffset && lastPage.nextPageOffset >= maxItemLimit && (
          <Button className="w-fit my-3.5 px-4 font-normal icon-wrapper"
            variant="secondary"
            size="sm"
            onClick={() => navigate('/budgets', {
              state: { background: location }
            })}
          >
            <WalletCards size={20} />
            View All Budgets
          </Button>
        )}

        {!maxItemLimit && lastPage?.nextPageOffset && (
          <div ref={observerRef}>
            {isFetchingNextPage && 'Loading...'} {/* TODO: skeleton */}
          </div>
        )}
      </div>
    </>
  ) : <>Loading...</> // TODO: skeleton
}

export default BudgetList
