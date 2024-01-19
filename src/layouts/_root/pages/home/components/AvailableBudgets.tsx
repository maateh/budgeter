// components
import CreateBudgetSheet from "@/components/shared/CreateBudgetSheet"
import BudgetPreview from "@/components/shared/BudgetPreview"

// models
import useStorage from "@/layouts/_root/context/useStorage"

const AvailableBudgets = () => {
  const { budgets } = useStorage()

  return (
    <>
      <div className="flex justify-between items-center gap-8 max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <h2><span className="text-orange-600 overline">Available</span> Budgets</h2>
        <CreateBudgetSheet />
      </div>

      <ul className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 items-center gap-8">
        {Object.values(budgets).map(budget => (
          <li className="mx-auto w-full max-w-sm lg:min-w-96" key={budget.id}>
            <BudgetPreview budget={budget} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default AvailableBudgets
