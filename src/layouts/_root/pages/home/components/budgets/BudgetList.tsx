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

const BudgetList = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { data, isLoading, hasNextPage } = usePaginatedBudgets()

  return !isLoading && data ? (
    <>
      <PaginationList className="flex flex-row flex-wrap justify-around gap-x-6 gap-y-4"
        itemProps={{ className: "flex-1 w-full sm:min-w-72 max-w-lg" }}
        pages={data.pages}
      >
        {(budget) => <BudgetPreview budget={budget} />}
      </PaginationList>

      {hasNextPage && (
        <div className="flex justify-center">
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
        </div>
      )}
    </>
  ) : <>Loading...</> // TODO: skeleton
}

export default BudgetList
