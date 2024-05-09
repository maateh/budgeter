// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetList from "@/components/shared/budget/BudgetList"

// hooks
import { useDialog } from "@/hooks"

const Budgets = () => {
  const { openDialog } = useDialog()

  return (
    <>
      <div className="mb-5 flex flex-wrap justify-between items-center gap-x-4 gap-y-2.5">
        <h2 className="border-emerald-600 dark:border-emerald-400 indent-border">
          Your <span className="text-emerald-600 dark:text-emerald-400 overline">Budgets</span>
        </h2>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          size="lg"
          onClick={() => openDialog('/budgets/create')}
        >
          <PackagePlus className="size-5" />
          New Budget
        </Button>
      </div>

      <BudgetList params={{ limit: 4, offset: 0 }} disableScrolling />
    </>
  )
}

export default Budgets
