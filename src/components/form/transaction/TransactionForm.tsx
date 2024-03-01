import { UUID } from "crypto"

// components
import Form from "@/components/form/Form"
import TransactionFormFields from "@/components/form/transaction/TransactionFormFields"

// hooks
import { useTransactionSubmit } from "@/components/form/transaction/hooks"

// types
import { Transaction } from "@/services/api/types"
import { TransactionFieldValues } from "@/components/form/transaction/types"

// validation
import { TransactionValidation } from "@/lib/validation"

type TransactionFormProps = {
  budgetId?: UUID
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  return (
    <Form<TransactionFieldValues, typeof TransactionValidation>
      type="create"
      validationSchema={TransactionValidation}
      defaultValues={{
        budgetId: budgetId || '',
        type: 'default' as Transaction['type'],
        name: '',
        payment: {
          type: '+' as Transaction['payment']['type'],
          amount: 0
        },
        processed: false
      }}
      useSubmit={useTransactionSubmit}
    >
      {(form) => (
        <TransactionFormFields
          budgetId={budgetId}
          form={form}
        />
      )}
    </Form>
  )
}

export default TransactionForm
