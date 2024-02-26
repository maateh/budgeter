// icons
import { AlarmClock, Receipt } from "lucide-react"

// components
import TabsSwitcher from "@/components/ui/custom/TabsSwitcher"
import Form from "@/components/form/Form"
import TransactionFormFields from "@/components/form/transaction/TransactionFormFields"

// hooks
import { useTransactionSubmit, useTemporaryTransactionSubmit } from "@/components/form/transaction/hooks"

// types
import { Transaction } from "@/services/api/types"
import { TransactionFieldValues } from "@/components/form/transaction/types"

// validations
import { TransactionValidation } from "@/lib/validation"

type TransactionFormProps = {
  budgetId?: string
}

const TransactionForm = ({ budgetId }: TransactionFormProps) => {
  const defaultValues: TransactionFieldValues = {
    budgetId: budgetId || '',
    type: '',
    name: '',
    payment: {
      type: '+',
      amount: 0
    },
    processed: false
  }

  return (
    <TabsSwitcher<Transaction['type']>
      label="Select the type of transaction"
      defaultValue="default"
      tabItems={[
        { value: 'default', Icon: Receipt, content: (
          <Form<TransactionFieldValues, typeof TransactionValidation>
            type="create"
            validationSchema={TransactionValidation}
            defaultValues={{
              ...defaultValues,
              type: 'default'
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
        )},
        { value: 'temporary', Icon: AlarmClock, content: (
          <Form<TransactionFieldValues, typeof TransactionValidation>
            type="create"
            validationSchema={TransactionValidation}
            defaultValues={{
              ...defaultValues,
              type: 'temporary'
            }}
            useSubmit={useTemporaryTransactionSubmit}
          >
            {(form) => (
              <TransactionFormFields
                budgetId={budgetId}
                form={form}
              />
            )}
          </Form>
        )}
      ]}
    />
  )
}

export default TransactionForm
