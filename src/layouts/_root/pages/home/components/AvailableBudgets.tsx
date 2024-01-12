// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetPreview from "@/components/shared/BudgetPreview"

const AvailableBudgets = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-8 max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <h2><span className="text-orange-600 overline">Available</span> Budgets</h2>
        <Button variant="outline" border="md" size="xl" className="ml-auto">New Budget</Button>
      </div>

      <ul className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 items-center gap-8">
        {/* TODO: every budget should have dedicated background and foreground colors */}
        <li className="mx-auto max-w-sm" key={1}>
          <BudgetPreview />
        </li>
        <li className="mx-auto max-w-sm" key={2}>
          <BudgetPreview />
        </li>
        <li className="mx-auto max-w-sm" key={3}>
          <BudgetPreview />
        </li>
      </ul>
    </>
  )
}

export default AvailableBudgets
