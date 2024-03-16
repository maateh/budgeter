// icons
import { Pencil, Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// types
import { Budget } from "@/services/api/types"

// hooks
import { useDialog } from "@/hooks"

type BudgetActionsProps = {
  budget: Budget
}

const BudgetActions = ({ budget }: BudgetActionsProps) => {
  const { openDialog } = useDialog()

  return (
    <div className="ml-auto flex flex-wrap-reverse items-center justify-end gap-y-2 gap-x-4">
      <Button className="icon-wrapper"
        variant="destructive"
        size="sm"
        onClick={() => openDialog(`/budgets/delete/${budget.id}`)}
      >
        <Trash2 size={18} />
        <span>Delete</span>
      </Button>

      <Button className="icon-wrapper"
        size="lg"
        onClick={() => openDialog(`/budgets/edit/${budget.id}`)}
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
