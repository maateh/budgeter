import { useNavigate } from "react-router-dom"

// icons
import { Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import ConfirmationDialog from "@/components/ui/custom/ConfirmationDialog"

// hooks
import { useDeleteBudget } from "@/lib/react-query/mutations"

// types
import { Budget } from "@/services/api/types"

type BudgetDeletionProps = {
  budget: Budget
}

const BudgetDeletion = ({ budget }: BudgetDeletionProps) => {
  const navigate = useNavigate()
  
  const { mutateAsync: deleteBudget } = useDeleteBudget(budget.id)

  const deleteConfirm = async () => {
    try {
      await deleteBudget(budget.id) 
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ConfirmationDialog
      title={`Delete Budget - ${budget.name}`}
      description="This action cannot be undone. This will permanently delete this budget and all associated transactions."
      variant="negative"
      action={deleteConfirm}
    >
      <Button
        variant="destructive"
        size="sm"
        className="flex items-center gap-x-1.5"
      >
        <Trash2 size={18} />
        <span>Delete</span>
      </Button>
    </ConfirmationDialog>
  )
}

export default BudgetDeletion
