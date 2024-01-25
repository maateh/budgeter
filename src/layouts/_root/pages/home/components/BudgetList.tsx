// types
import Budget, { BudgetType } from "@/models/Budget"

// components
import BudgetPreview from "@/components/shared/BudgetPreview"

type BudgetListProps = {
  budgets: Budget[]
  type: BudgetType
}

const BudgetList = ({ budgets, type }: BudgetListProps) => {
  return (
    <>
      <h2 className="w-fit mb-3">
        <span className={`overline
          ${type === BudgetType.INCOME
            ? 'text-green-400' 
            : 'text-red-500'}
        `}>
          {type}
        </span> Budgets
      </h2>

      <ul className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
        {budgets.map(budget => (
          <li className="mx-auto w-full max-w-sm" key={budget.id}>
            <BudgetPreview budget={budget} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default BudgetList