import { useLocation, useNavigate } from "react-router-dom"

// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import BudgetList from "@/components/shared/budget/BudgetList"

const Budgets = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader className="mt-4 mx-2 flex flex-row flex-wrap justify-between items-center gap-x-4 gap-y-2.5 sm:mt-2">
        <DialogTitle className="text-2xl indent-border">
          Your <span className="text-blue-600 dark:text-blue-500 overline">Budgets</span>
        </DialogTitle>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          size="lg"
          onClick={() => navigate('/budgets/create', {
            state: { background: location.state },
            replace: true
          })}
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
