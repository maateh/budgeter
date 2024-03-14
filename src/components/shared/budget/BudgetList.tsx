import { useLocation, useNavigate } from "react-router-dom"

// icons
import { WalletCards } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import PaginationList from "@/components/pagination-list/PaginationList"
import BudgetPreview from "@/components/shared/budget/BudgetPreview"

// hooks
import { usePaginatedBudgets } from "@/lib/react-query/queries"
import { usePagination } from "@/components/pagination-list/hooks"

type BudgetListProps = {
  disableScrolling?: boolean
}

const BudgetList = ({ disableScrolling }: BudgetListProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = usePaginatedBudgets({ disableScrolling })

  const { observerRef } = usePagination({ data, fetchNextPage, disableScrolling })

  return !isLoading && data ? (
    <>
      <PaginationList className="flex flex-row flex-wrap justify-around gap-x-6 gap-y-4"
        itemProps={{ className: "flex-1 w-full max-w-md sm:min-w-72 max-sm:min-w-56" }}
        pages={data.pages}
      >
        {(budget) => <BudgetPreview budget={budget} />}
      </PaginationList>

      <div ref={observerRef}>
        {isFetchingNextPage && <>Loading...</>} {/* TODO: skeleton */}
      </div>

      {disableScrolling && hasNextPage && (
        <Button className="w-fit mx-auto my-4 px-4 font-normal icon-wrapper"
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
    </>
  ) : <>Loading...</> // TODO: skeleton
}

export default BudgetList
