// shadcn
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import BudgetForm from "@/components/form/budget/BudgetForm"

type SaveBudgetProps = {
  type: 'create' | 'edit'
}

const SaveBudget = ({ type }: SaveBudgetProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-3xl capitalize">
          {type} <span className="text-green-400 overline">Budget</span>
        </DialogTitle>
      </DialogHeader>

      <Separator />

      <BudgetForm type={type} />
    </DialogContent>
  )
}

export default SaveBudget
