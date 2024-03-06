import { UUID } from "crypto"
import { useParams } from "react-router-dom"

// components
import FormDialog from "@/components/form/FormDialog"
import BudgetForm from "@/components/form/budget/BudgetForm"

// hooks
import { useGetBudget } from "@/lib/react-query/queries"

const BudgetEditFormDialog = () => {
  const { id } = useParams() as { id: UUID }

  const { data: budget, isLoading } = useGetBudget(id)

  return !isLoading && budget ? (
    <FormDialog
      title={<>Edit <span className="text-green-400 overline">Budget</span></>}
    >
      <BudgetForm type="edit" budget={budget} />
    </FormDialog>
  ) : <>Loading...</> // TODO: skeleton
}

export default BudgetEditFormDialog
