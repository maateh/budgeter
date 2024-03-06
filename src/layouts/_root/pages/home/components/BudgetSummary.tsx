import { useLocation, useNavigate } from "react-router-dom"

// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

const BudgetSummary = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <div className="mb-5 flex justify-between">
        <h2>Budget <span className="text-green-600 overline">Summary</span></h2>
        <Button className="flex items-center gap-x-2"
          size="lg"
          onClick={() => navigate('/budgets/create', {
            state: { background: location }
          })}
        >
          <PackagePlus />
          <span>New Budget</span>
        </Button>
      </div>
    </>
  )
}

export default BudgetSummary
