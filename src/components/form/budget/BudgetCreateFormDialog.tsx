// components
import FormDialog from "@/components/form/FormDialog"
import BudgetForm from "@/components/form/budget/BudgetForm"

const BudgetCreateFormDialog = () => {
  return (
    <FormDialog
      title={<>Create <span className="text-green-400 overline">Budget</span></>}
    >
      <BudgetForm type="create" />
    </FormDialog>
  )
}

export default BudgetCreateFormDialog
