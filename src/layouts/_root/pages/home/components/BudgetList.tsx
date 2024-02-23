// types
import { Budget } from "@/services/api/types"

// components
import BudgetPreview from "@/components/shared/BudgetPreview"

type BudgetListProps = {
  budgets: Budget[]
  type: Budget['type']
}

const BudgetList = ({ budgets, type }: BudgetListProps) => {
  return (
    <>
      <h2 className="w-fit mb-5">
        <span className={`overline
          ${type === 'income'
            ? 'text-green-500' 
            : 'text-red-500'}
        `}>
          {type}
        </span> Budgets
      </h2>

      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
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
