import { useNavigate } from "react-router-dom"

// components
import ConfirmationDialog from "@/components/ui/custom/ConfirmationDialog"

// hooks
import { useDeleteBudget } from "@/lib/react-query/mutations"

// types
import { Budget } from "@/services/api/types"

type BudgetDeletionProps = {
  budget: Budget
} & React.PropsWithChildren

const BudgetDeletion = ({ budget, children }: BudgetDeletionProps) => {
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
      {children}
    </ConfirmationDialog>
  )
}

export default BudgetDeletion
