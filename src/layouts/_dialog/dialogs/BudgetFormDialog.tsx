// shadcn
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import BudgetForm from "@/components/form/budget/BudgetForm"

type BudgetFormDialogProps = {
  type: 'create' | 'edit'
}

const BudgetFormDialog = ({ type }: BudgetFormDialogProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl">
          Create <span className="text-green-400 overline">Budget</span>
        </DialogTitle>
      </DialogHeader>

      <Separator />

      <BudgetForm type={type} />
    </>
  )
}

export default BudgetFormDialog
