// components
import PaginationList from "@/components/pagination-list/PaginationList"
import BudgetPreview from "@/components/shared/budget/BudgetPreview"
// import { useScrollingPagination } from "@/components/pagination-list/hooks"

// hooks
import { useGetBudgetsWithTransactions } from "@/lib/react-query/queries"

type BudgetListProps = {
  maxItemLimit?: number
  transactionLimit?: number
}

const BudgetList = ({ maxItemLimit = 4, transactionLimit = 7 }: BudgetListProps) => {
  const { data, isLoading, fetchNextPage } = useGetBudgetsWithTransactions(transactionLimit)

  // TODO: it will be required after dialog layout is implemented for listing budgets
  // const { observerRef } = useScrollingPagination({
  //   data, fetchNextPage, maxItemLimit
  // })

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
    </>
  ) : <>Loading...</> // TODO: skeleton
}

export default BudgetList
