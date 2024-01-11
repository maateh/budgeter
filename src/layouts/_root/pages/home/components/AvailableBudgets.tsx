import BudgetPreview from "@/components/shared/BudgetPreview"


const AvailableBudgets = () => {
  return (
    <>
      <h2><span className="text-orange-600 overline">Available</span> Budgets</h2>

      <ul className="w-full mt-4 grid lg:grid-cols-2 items-center gap-8">
        {/* TODO: every budget should have dedicated background and foreground colors */}
        <li className="w-10/12 lg:w-full mx-auto" key={1}>
          <BudgetPreview />
        </li>
        <li className="w-10/12 lg:w-full mx-auto" key={2}>
          <BudgetPreview />
        </li>
        <li className="w-10/12 lg:w-full mx-auto" key={3}>
          <BudgetPreview />
        </li>
      </ul>
    </>
  )
}

export default AvailableBudgets
