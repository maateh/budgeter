// icons
import { Coins, Edit, MoreVertical, Trash2 } from "lucide-react"

// components
import DropdownActions from "@/components/ui/custom/DropdownActions"

// hooks
import { useDialog } from "@/hooks"

// types
import { Budget } from "@/services/api/types"
import { Button } from "@/components/ui/button"

type BudgetActionsProps = {
  budget: Budget
}

const BudgetActions = ({ budget }: BudgetActionsProps) => {
  const { openDialog } = useDialog()

  return (
    <DropdownActions
      actions={[
        {
          name: 'Edit',
          Icon: Edit,
          onClick: () => openDialog(`/budgets/edit/${budget.id}`)
        },
        {
          name: 'Transfer Money',
          Icon: Coins,
          variant: 'accent',
          onClick: () => openDialog(`/budgets/transfer/${budget.id}`)
        },
        {
          name: 'Delete',
          Icon: Trash2,
          variant: 'destructive',
          onClick: () => openDialog(`/budgets/delete/${budget.id}`, {}, { budget })
        }
      ]}
    >
      <Button className="ml-auto expandable"
       variant="ghost"
       size="icon"
      >
        <span>Show Actions</span>
        <MoreVertical className="size-4 sm:size-5" />
      </Button>
    </DropdownActions>
  )
}

export default BudgetActions
