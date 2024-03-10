// components
import BudgetPreview from "@/components/shared/budget/BudgetPreview"

// hooks
import { useGetBudgets, /*useGetBudgetsWithTransactions*/ } from "@/lib/react-query/queries"

const BudgetList = () => {
  // const { data: budgets, isLoading } = useGetBudgetsWithTransactions() // TODO: implement
  const { data: budgets, isLoading } = useGetBudgets()

  return !isLoading && budgets ? (
    <ul className="flex flex-wrap justify-around gap-x-6 gap-y-4">
      {budgets.map((budget) => (
        <li className="flex-1 w-full sm:min-w-72 max-w-lg"
          key={budget.id}
        >
          <BudgetPreview budget={budget} />
        </li>
      ))}
    </ul>
  ) : <>Loading...</> // TODO: skeleton
}

export default BudgetList
