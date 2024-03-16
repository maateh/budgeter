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
        <h2 className="indent-border">
          Recent <span className="text-blue-600 dark:text-blue-500 overline">Budgets</span>
        </h2>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          size="lg"
          onClick={() => openDialog('/budgets/create')}
        >
          <PackagePlus />
          <span>New Budget</span>
        </Button>
      </div>

      <BudgetList disableScrolling />
    </>
  )
}

export default Budgets
