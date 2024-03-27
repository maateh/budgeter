import { useParams } from "react-router-dom"

// shadcn
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import BudgetForm from "@/components/form/budget/BudgetForm"

const SaveBudget = () => {
  const { id } = useParams() as { id: string }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-3xl capitalize">
          {id ? 'Edit' : 'Create'} <span className="text-green-400 overline">Budget</span>
        </DialogTitle>
      </DialogHeader>

      <Separator />

      <BudgetForm id={id} />
    </DialogContent>
  )
}

export default SaveBudget
