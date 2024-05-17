// components
import Listing from "@/components/ui/custom/Listing"
import BudgetPreview from "@/components/shared/budget/ui/BudgetPreview"
import BudgetListSkeleton from "@/components/shared/budget/BudgetList.skeleton"

// hooks
import { useBudgetsPagination } from "@/lib/react-query/queries"
import { usePagination } from "@/hooks"

// types
import { Budget, QueryOptions } from "@/services/api/types"

const BudgetList = ({ filter, params, sortBy }: QueryOptions<Budget>) => {
  const {
    data, isLoading, isFetchingNextPage, fetchNextPage
  } = useBudgetsPagination({ filter, params, sortBy })

  const { observerRef } = usePagination({ data, fetchNextPage })

  if (isLoading || !data) {
    return <BudgetListSkeleton />
  }

  // TODO: add filter
  return (
    <>
      <Listing className="mb-4 flex flex-row flex-wrap justify-around gap-x-6 gap-y-4"
        fallbackProps={{ value: "There is no budget to display.", size: 'lg' }}
        itemProps={{ className: "flex-1 w-full max-w-md sm:min-w-72 max-sm:min-w-56" }}
        pages={data.pages}
      >
        {(budget) => <BudgetPreview budget={budget} />}
      </Listing>

      <div ref={observerRef}>
        {isFetchingNextPage && <BudgetListSkeleton />}
      </div>
    </>
  )
}

export default BudgetList
