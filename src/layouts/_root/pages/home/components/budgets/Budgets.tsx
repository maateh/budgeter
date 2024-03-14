import { useLocation, useNavigate } from "react-router-dom"

// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetList from "./BudgetList"

const Budgets = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <div className="mb-5 flex flex-wrap justify-between items-center gap-x-4 gap-y-2.5">
        <h2 className="pl-2 border-l-4 rounded">
          Recent <span className="text-blue-600 dark:text-blue-500 overline">Budgets</span>
        </h2>

        <Button className="ml-auto bg-primary/40 icon-wrapper"
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

      <BudgetList />
    </>
  )
}

export default Budgets
