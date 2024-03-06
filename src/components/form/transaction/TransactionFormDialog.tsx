import { UUID } from "crypto"
import { useParams } from "react-router-dom"

// components
import FormDialog from "@/components/form/FormDialog"
import TransactionForm from "@/components/form/transaction/TransactionForm"

const TransactionFormDialog = () => {
  const { budgetId } = useParams() as { budgetId?: UUID }

  return (
    <FormDialog
      title={<>Add <span className="text-accent overline">Transaction</span></>}
    >
      <TransactionForm budgetId={budgetId} />
    </FormDialog>
  )
}

export default TransactionFormDialog
