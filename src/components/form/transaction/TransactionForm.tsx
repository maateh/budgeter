
// components
import Form from "@/components/form/Form"
import TransactionFormFields from "@/components/form/transaction/TransactionFormFields"

// hooks
import { useTransactionSubmit } from "@/components/form/transaction/hooks"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"

// validations
import { transactionFormSchema } from "@/lib/validations"

type TransactionFormProps = {
  budgetId?: string
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  return (
    <Form<TransactionFieldValues, typeof transactionFormSchema>
      type="create"
      validationSchema={transactionFormSchema}
      defaultValues={{
        budgetId: budgetId || '',
        type: 'default',
        name: '',
        payment: {
          type: '+',
          amount: 0
        },
        processed: false
      }}
      useSubmit={useTransactionSubmit}
    >
      {(form) => <TransactionFormFields {...form} budgetId={budgetId} />}
    </Form>
  )
}

export default TransactionForm
