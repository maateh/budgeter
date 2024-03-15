import { useLocation, useNavigate } from "react-router-dom"

// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetList from "@/components/shared/budget/BudgetList"

const Budgets = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <div className="mb-5 flex flex-wrap justify-between items-center gap-x-4 gap-y-2.5">
        <h2 className="indent-border">
          Recent <span className="text-blue-600 dark:text-blue-500 overline">Budgets</span>
        </h2>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          size="lg"
          onClick={() => navigate('/budgets/create', {
            state: { background: location }
          })}
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