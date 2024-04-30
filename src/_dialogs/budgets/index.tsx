// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import BudgetList from "@/components/shared/budget/BudgetList"

// hooks
import { useDialog } from "@/hooks"

const Budgets = () => {
  const { openDialog } = useDialog()

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader className="mt-4 mx-2 flex flex-row flex-wrap justify-between items-center gap-x-4 gap-y-2.5 sm:mt-2">
        <DialogTitle className="text-2xl border-emerald-600 dark:border-emerald-400 indent-border">
          Your <span className="text-emerald-600 dark:text-emerald-400 overline">Budgets</span>
        </DialogTitle>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          size="lg"
          onClick={() => openDialog('/budgets/create', { replace: true })}
        >
          <PackagePlus />
          <span>New Budget</span>
        </Button>
      </DialogHeader>

      <Separator className="mx-auto w-11/12" />

      {/* TODO: add filter */}

      <BudgetList />
    </DialogContent>
  )
}

export default Budgets
