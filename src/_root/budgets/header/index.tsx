import { useParams } from "react-router-dom"

// components
import BudgetNameBadge from "@/components/shared/budget/ui/BudgetNameBadge"
import BudgetActions from "@/components/shared/budget/ui/BudgetActions"
import BudgetHeaderSkeleton from "./skeleton"

// hooks
import { useBudget } from "@/lib/react-query/queries"

const BudgetHeader = () => {
  const { id } = useParams() as { id: string }

  const { data: budget, isLoading } = useBudget(id)

  if (isLoading || !budget) {
    return <BudgetHeaderSkeleton />
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-5">
      <BudgetNameBadge className="py-3.5 text-xl sm:text-2xl"
        size="lg"
        budget={budget}
      />

      <BudgetActions budget={budget} />
    </div>
  )
}

export default BudgetHeader
