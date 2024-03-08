import { useLocation, useNavigate } from "react-router-dom"

// icons
import { Pencil, Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetDeletion from "@/components/shared/budget/BudgetDeletion"

// types
import { Budget } from "@/services/api/types"

type BudgetActionsProps = {
  budget: Budget
}

const BudgetActions = ({ budget }: BudgetActionsProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="ml-auto flex flex-wrap-reverse items-center justify-end gap-y-2 gap-x-4">
      {/* TODO: move delete action to dialog layout */}
      <BudgetDeletion budget={budget}>
        <Button className="w-fit flex items-center gap-x-1.5"
          variant="destructive"
          size="sm"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </Button>
      </BudgetDeletion>

      <Button className="icon-wrapper"
        size="lg"
        onClick={() => navigate(`/budgets/edit/${budget.id}`, {
          state: { background: location }
        })}
      >
        <Pencil size={18} />
        <span>Edit</span>
      </Button>

      {/* TODO: implement transfer money action */}
      {/* <Button className="icon-wrapper bg-blue-600 dark:bg-blue-400 hover:bg-blue-600/90 hover:dark:bg-blue-400/90"
        size="lg"
        onClick={() => {}}
      >
        <span>Transfer Money</span>
        <Coins size={18} />
      </Button> */}
    </div>
  )
}

export default BudgetActions
